# Blync-Node

A simple Node.JS/Javascript example for controlling an [Embrava Blynclight](https://amzn.to/2BWTuGw) as a HID (Human Interface Device) object. I have actually used this set up in a [TV Studio](http://offbeatmammal.com/2018/08/28/pi-and-blyncing-lights/)!

How to use
----------
Assuming you have a current NodeJS installation, you will need to make sure you have the [node-hid](https://github.com/node-hid/node-hid) module installed (see note below if using Raspberry Pi), and then download the contents of this repository (at a minimum test.js, blync.js, device.js, and package.json) and run the sample <code>node test.js</code>.

To define new Blynclight devices add the <code>dev.productId</code> to the list on line 10 in <code>blync.js</code> (currently supports the standard and mini devices).

To control the light, see sample code in <code>test.js</code> but essentially you use:

<code>
Blync = require('./blync');
var device = Blync.getDevice(0);
device.sendCommand(r, g, b,dim,blink);
</code>

where:
* <code>r,g,b</code> are the red, green, and blue colours (0-255)
* <code>dim</code> is a true/false value to set the light to full brightness, or dimmed
* <code>blink</code> is set to 0 for steady, 1 for 'slow', 2 for 'medium', and 3 for 'fast' blinking

By default the Blynclight will remain active and in a steady state provided power is maintained, but the <code>test.js</code> sample includes a <code>device.sendCommand</code> to deactivate the light in the exit handler

Running from a web server
----------

The <code>web.js</code> file shows an example of a simple NodeJS web server that displays a form and allows you to control the lights.

I actually have it configured on my RaspberryPi to automatically start the web script following a reboot via crontab. I edit crontab using <code>crontab -e</code> and add the following line to the end of the file:
<code>@reboot /home/pi/blync/auto.sh</code>. That runs the auto.sh script (you may need to adjust paths both in crontab and the script to suit your own configuration, as well as make the script executable <code>chmod +x auto.sh</code>).

Raspberry Pi / Raspbian
----------
I assume you've already got a current Raspbian build on your RaspberryPi (only tested with a B+), as well as working Node environment, but if not [this guide](http://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/) covers most of what you need to know.
Note: As there isn't a predefined binary for Raspberry Pi currently, you will need to build from source and adjust permissions. To build from source see [this StackOverflow post](https://stackoverflow.com/a/23628625/1569675) and you will need to either adjust the permissions as [defined here](https://github.com/node-hid/node-hid#udev-device-permissions) (you can use the <code>embrava.rules</code> file in this repository) or run the node script with elevated permissions, eg: <code>sudo node test.js</code>.
If you want to use the RaspberryPi as a self-contained hotspot to control the Blynclight, see [these instructions](https://howtoraspberrypi.com/create-a-wi-fi-hotspot-in-less-than-10-minutes-with-pi-raspberry/).

To Do
----------
* add additional Blynclight devices (once I have the CommandBuffer worked out)
* add the musicControl logic
* only supports first Blynclight device it finds, what if there is >1? (need more devices to test!)
* consolidation and optimization 
* make it all a bit more robust

----------
If you make use of this and like it and want to give something back... [I wrote a book!](http://amzn.to/1SHjbLI) :)

----------

Contribute
----------
This project can be forked from
[Github](https://github.com/Offbeatmammal/blync-node). Please issue pull
requests from feature branches.

License
-------
See Licence file in repo, or refer to http://unlicense.org
