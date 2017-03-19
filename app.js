var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var server = require('socket.io');
var pty = require('pty.js');
var fs = require('fs');
var mdns = require('mdns');
var net = require('net');
var WebSocketServer = require('ws').Server;

var opts = require('optimist')
    .options({
        sslkey: {
            demand: false,
            description: 'path to SSL key'
        },
        sslcert: {
            demand: false,
            description: 'path to SSL certificate'
        },
        sshhost: {
            demand: false,
            description: 'ssh server host'
        },
        sshport: {
            demand: false,
            description: 'ssh server port'
        },
        sshuser: {
            demand: false,
            description: 'ssh user'
        },
        sshauth: {
            demand: false,
            description: 'defaults to "password", you can use "publickey,password" instead'
        },
        vnchost: {
            demand: false,
            description: 'vnc server host, defaults to localhost'
        },
        vncport: {
            demand: false,
            description: 'vnc server port, defaults to 5900'
        },
        port: {
            demand: true,
            alias: 'p',
            description: 'wetty listen port'
        },
    }).boolean('allow_discovery').argv;

var runhttps = false;
var sshport = opts.sshport ? opts.sshport : 22;
var sshhost = opts.sshhost ? opts.sshhost : 'localhost';
var sshauth = opts.sshauth ? opts.sshauth : 'password';
var globalsshuser = opts.sshuser ? opts.sshuser : '';
var vnchost = opts.vnchost ? opts.vnchost : 'localhost';
var vncport = opts.vncport ? opts.vncport : 5900;

if (opts.sslkey && opts.sslcert) {
    runhttps = true;
    opts['ssl'] = {};
    opts.ssl['key'] = fs.readFileSync(path.resolve(opts.sslkey));
    opts.ssl['cert'] = fs.readFileSync(path.resolve(opts.sslcert));
}

process.on('uncaughtException', function(e) {
    console.error('Error: ' + e);
});

var httpServer, wsServer;

var app = express();
app.get('/ssh', function(req, res) {
    res.sendfile(__dirname + '/public/wetty/index.html');
});
app.get('/ssh/:user', function(req, res) {
    res.sendfile(__dirname + '/public/wetty/index.html');
});
app.get('/vnc', function(req, res) {
    res.sendfile(__dirname + '/novnc/vnc.html');
});
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/novnc', express.static(path.join(__dirname, 'novnc')));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

if (runhttps) {
    httpServer = https.createServer(opts.ssl, app).listen(opts.port, function() {
        console.log('https on port ' + opts.port);
        wsServer = new WebSocketServer({server: httpServer});
        wsServer.on('connection', newWebSocketClient);
    });
} else {
    httpServer = http.createServer(app).listen(opts.port, function() {
        console.log('http on port ' + opts.port);
        wsServer = new WebSocketServer({server: httpServer});
        wsServer.on('connection', newWebSocketClient);
    });
}

// Start advertisement for SSH terminal over FlyWeb
var advertisement = mdns.createAdvertisement(mdns.tcp('flyweb'), opts.port, {
  name: 'FlyPi',
  txtRecord: {}
});
advertisement.start();

var newWebSocketClient = function(client) {
    var clientAddr = client._socket.remoteAddress, log;
    console.log(client.upgradeReq.url);
    log = function (msg) {
        console.log(' ' + clientAddr + ': '+ msg);
    };
    log('WebSocket connection');
    log('Version ' + client.protocolVersion + ', subprotocol: ' + client.protocol);

    var target = net.createConnection(vncport, vnchost, function() {
        log('connected to target');
    });

    target.on('data', function(data) {
        //log("sending message: " + data);
        try {
            client.send(data);
        } catch(e) {
            log("Client closed, cleaning up target");
            target.end();
        }
    });

    target.on('end', function() {
        log('target disconnected');
        client.close();
    });

    target.on('error', function() {
        log('target connection error');
        target.end();
        client.close();
    });

    client.on('message', function(msg) {
        //log('got message: ' + msg);
        target.write(msg);
    });

    client.on('close', function(code, reason) {
        log('WebSocket client disconnected: ' + code + ' [' + reason + ']');
        target.end();
    });

    client.on('error', function(a) {
        log('WebSocket client error: ' + a);
        target.end();
    });
};

var io = server(httpServer,{path: '/wetty/socket.io'});
io.on('connection', function(socket){
    var sshuser = '';
    var request = socket.request;
    console.log((new Date()) + ' Connection accepted.');
    if (match = request.headers.referer.match('/wetty/ssh/.+$')) {
        sshuser = match[0].replace('/wetty/ssh/', '') + '@';
    } else if (globalsshuser) {
        sshuser = globalsshuser + '@';
    }

    var term;
    if (process.getuid() === 0) {
        term = pty.spawn('/bin/login', [], {
            name: 'xterm-256color',
            cols: 80,
            rows: 30
        });
    } else {
        term = pty.spawn('ssh', [sshuser + sshhost, '-p', sshport, '-o', 'PreferredAuthentications=' + sshauth], {
            name: 'xterm-256color',
            cols: 80,
            rows: 30
        });
    }
    console.log((new Date()) + " PID=" + term.pid + " STARTED on behalf of user=" + sshuser)
    term.on('data', function(data) {
        socket.emit('output', data);
    });
    term.on('exit', function(code) {
        console.log((new Date()) + " PID=" + term.pid + " ENDED")
    });
    socket.on('resize', function(data) {
        term.resize(data.col, data.row);
    });
    socket.on('input', function(data) {
        term.write(data);
    });
    socket.on('disconnect', function() {
        term.end();
    });
})
