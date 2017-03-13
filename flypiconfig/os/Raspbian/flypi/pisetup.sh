sudo apt-get --assume-yes update --fix-missing
touch 1
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash - && sudo apt --assume-yes install nodejs
touch 2
sudo apt-get --assume-yes install build-essential libavahi-compat-libdnssd-dev tightvncserver expect
touch 3

./spawnvnc.sh
touch 4
vncserver
touch 5

git clone https://github.com/flyweb/FlyPi.git && cd FlyPi && git checkout feature/config
touch 6
sudo npm install -g node-gyp && npm install
touch 7
( cd node_modules/pty.js && make clean && node-gyp configure --release && node-gyp build )
touch 8
