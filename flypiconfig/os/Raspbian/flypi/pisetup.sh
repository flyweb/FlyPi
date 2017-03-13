sudo apt-get --assume-yes update --fix-missing
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash - && sudo apt --assume-yes install nodejs
sudo apt-get --assume-yes install build-essential libavahi-compat-libdnssd-dev tightvncserver expect

./spawnvnc.sh
vncserver

sudo mv /home/pi/rc.local /etc/rc.local

git clone https://github.com/flyweb/FlyPi.git && cd FlyPi && git checkout feature/config
sudo npm install -g node-gyp && npm install
( cd node_modules/pty.js && make clean && node-gyp configure --release && node-gyp build )

sudo reboot
