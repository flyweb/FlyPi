var path = require('path');
var express = require('express');
var WiFiControl = require('wifi-control');
var validate = require('express-validation');
var Joi = require('joi');

var app = express();
var router = express.Router();

var postSchema = {
    body: {
        ssid: Joi.string().required(),
        password: Joi.string().required().allow('')
    }
};

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'wifi.html'));
});

router.get('/scan', function(req, res) {
    console.log('scanning for wifi');
    WiFiControl.scanForWiFi((err, response) => {
        if (err) {
            console.log(err);
            res.json({error: err});
        } else {
            res.json(response);
        }
    });
});

router.post('/connect', validate(postSchema), function(req, res) {
    WiFiControl.connectToAP(req, (err, response) => {
        if (err) {
            console.log(err);
            res.json(err);
        } else {
            res.json(response);
        }
    });
});

router.use(function(err, req, res, next) {
    if (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;