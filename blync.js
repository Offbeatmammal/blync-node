var hid = require('node-hid');

var Blync = {
  getDevices: function ()
  {
    var devices = hid.devices();

    devices = devices.filter(function (dev) {
      // this finds the first Blync Standard or Mini (other devices will need to be added)
      return dev.vendorId === 3667 && (dev.productId === 9497 || dev.productId === 9495); 
      // on macOS/Windows, dev.interface === -1, but on Raspbian shows as 0, so removing for now:
      // && dev.interface === -1;
  
    });

    devices = devices.map(function (dev) {
      return new Blync.Device(new hid.HID(dev.path));
    });

    return devices;
  },

  getDevice: function (index)
  {
    index = +index || 0;

    var devices = this.getDevices();
    if (index < 0) {
      throw new Error("Invalid device index");
    }
    if (index >= devices.length) {
      throw new Error("Device index #"+index+" not found");
    }

    return devices[index];
  }
};

Blync.Device = require('./device').Device;

module.exports = Blync;