# FlyPi

Raspberry Pi initial setup tool that enables browser SSH and VNC access over the local network using FlyWeb. This project aims to simplify the initial setup process for headless Raspberry Pi devices to a single step, saving time for newbies and veterans alike!

Contributions are welcome. :)

Install
-------

1. Install [PiBakery](http://www.pibakery.org/download.html) for your selected operating system (Mac and Windows supported). PiBakery contains a full version of the latest Raspbian image and is used to run the post-install operations required to configure FlyPi.
2. Open PiBakery and click Import. Select the PiBakeryRecipe.xml file located in the root of this repository.
3. Input the credentials for your WiFi network in the first block.
3. Format your MicroSD card using FAT.
4. Click Write in PiBakery and select your SD card in the first box. Make sure that Raspbian Full is selected in the second box, then click Start Write (note that this step can take upwards of five minutes, this is normal).
5. Once the write has been completed, place your SD card into your Raspberry Pi and power up as normal. PiBakery will then install Raspbian and configure the required dependencies for FlyPi, this could take upwards of ten minutes depending on network speed.
6. Once setup has been completed, your Raspberry Pi should reboot and the FlyPi homepage should be advertised on your local network over FlyWeb.
7. (Optional) Both VNC and SSH will be configured with the default password "raspberry". We strongly recommend that you change the default password and perform a full update of system packages for security reasons.

Usage:
-------

1. Select the "FlyPi" service advertised over FlyWeb from within Firefox.
2. Select whether you'd like to access the SSH or VNC terminal.
3. Input the password for either the pi user or VNC client (default: "raspberry").
4. Congratulations, you're in!
