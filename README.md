# FlyPi

Raspberry Pi initial setup and maintenance tool using FlyWeb that allows users to configure WiFi settings and access SSH and VNC through the browser. The goal of this project aims to simplify the initial setup and regular access to "headless" Raspberry Pi devices.

The current version of the project currently only supports SSH.

### Features
- Initial setup mode
  - Raspberry Pi acts as a WiFi AP
  - FlyWeb application lets users select their home WiFi network and provide credentials
  - Set SSH/VNC username and password
- Maintenance mode
  - Raspberry Pi joins home WiFi network
  - FlyWeb application lets users SSH and VNC into the Raspberry Pi through the browser

Install
-------

*  `npm install`

Use VNC:
-------

First, install tightvnc:

  `sudo apt-get install tightvnc`

 Run `vncserver`. It will prompt you to set a password for VNC.

Then, add the following lines to `/etc/rc.local`:

  ```
  su pi -c 'vncserver'
  su pi -c 'node [FlyPi directory]/app.js -p 3000 --vncport 5901 < /dev/null &'
  ```

This will start a VNC server and FlyPi whenever the Raspberry Pi boots.
Reboot, and you should be able to access FlyPi using FlyWeb, and the VNC
client at `/vnc`.

Run on HTTP:
-----------

    node app.js -p 3000

If you run it as root it will launch `/bin/login` (where you can specify
the user name), else it will launch `ssh` and connect by default to
`localhost`.

If instead you wish to connect to a remote host you can specify the
`--sshhost` option, the SSH port using the `--sshport` option and the
SSH user using the `--sshuser` option.

You can also specify the SSH user name in the address bar like this:

  `http://yourserver:3000/wetty/ssh/<username>`

A noVNC client is available at `/vnc`.

Run on HTTPS:
------------

Always use HTTPS! If you don't have SSL certificates from a CA you can
create a self signed certificate using this command:

  `openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 30000 -nodes`

And then run:

    node app.js --sslkey key.pem --sslcert cert.pem -p 3000

Again, if you run it as root it will launch `/bin/login`, else it will
launch SSH to `localhost` or a specified host as explained above.