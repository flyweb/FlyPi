sudo apt-get --assume-yes update
touch /home/pi/1
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash - && sudo apt-get --assume-yes install nodejs
touch /home/pi/2
sudo apt-get --assume-yes install build-essential libavahi-compat-libdnssd-dev tightvncserver expect
touch /home/pi/3

cd /home/pi && /home/pi/spawnvnc.sh
touch /home/pi/4
vncserver
touch /home/pi/5

git clone https://github.com/flyweb/FlyPi.git && cd FlyPi
touch /home/pi/6
sudo npm install -g node-gyp && npm install
touch /home/pi/7
( cd node_modules/pty.js && make clean && node-gyp configure --release && node-gyp build )
touch /home/pi/8
