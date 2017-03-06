sudo apt --assume-yes update && sudo apt --assume-yes full-upgrade
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash - && sudo apt --assume-yes install nodejs
sudo apt-get --assume-yes install build-essential libavahi-compat-libdnssd-dev tightvnc expect

chmod +x spawnvnc.sh
./spawnvnc.sh

# Add lines to /etc/rc.local
# su pi -c 'vncserver'
# su pi -c 'node /home/pi/FlyPi/remote/app.js -p 3000 --vncport 5901 && node /home/pi/FlyPi/scripts/start.js < /dev/null &'

git clone https://github.com/flyweb/FlyPi.git && cd FlyPi && git checkout feature/setup
sudo npm install -g node-gyp && npm install
( cd node_modules/pty.js && make clean && node-gyp configure --release && node-gyp build )

# sudo reboot
