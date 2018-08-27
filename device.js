var Device = function (hidDevice) {
  this.hidDevice = hidDevice;
};

function toInt(value) {
  // check value is an integer (and cast as needed), and if not return zero 
  if (!isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10)) ) {
           return parseInt(value)
         } else {
           return 0
         }
}

Device.prototype.sendCommand = function (red, green, blue, dim = false, blink = 0) {

  // make sure the parameters are all integer
  red = toInt(red)
  green = toInt(green)
  blue = toInt(blue)
  blink = toInt(blink)

  lightControl = 0b000000
  // Bit0: 0 - Light On, 1 - Light Off 
  // Bit1: 0 - No Dim (Full Brightness), 1 - Dim by 50%
  if (dim) {
    lightControl += 0b000010
  }
  // Bit2: 0 - No Flash, 1- Start Flash (Blink)
  // Bit5-Bit3 - Flash speed - 001 - slow, 010 - medium, 100- fast
  switch (blink) {
  case 0:
    // no blink
    break;
  case 1: // slow
    lightControl += 0b001100
    break;
  case 2: // medium
    lightControl += 0b010100
    break;
  case 3: // slow
    lightControl += 0b100100
    break;
  }

//musicControl1 byte => Bit7-Bit0
//Bit3-Bit0: Choose music, corresponding from the music 1 to music 10 respectively,total 10 music
//Bit4: 0 - Stop Playing Music, 1 - Start Music Play
//Bit5: 0 - Stop Music Repeat, 1 - Start Music Repeat
//Bit6-Bit7: 00

//musicControl2 byte => Bit7-Bit0
//Bit3-Bit0: 1-10 corresponding from 10% volume to 100% volume respectively, total 10 level volumes
//Bit6-Bit4: 000
//Bit7: 0 - Clear Mute, 1 - Mute Volume
  
  var commandBuffer = [];

  commandBuffer[0] = 0x00;
  commandBuffer[1] = red;
  commandBuffer[2] = blue;
  commandBuffer[3] = green;
  commandBuffer[4] = lightControl;
  commandBuffer[5] = 0x00; // musicControl1
  commandBuffer[6] = 0x00; // musicControl2
  commandBuffer[7] = 0xFF;
  commandBuffer[8] = 0xFF;
    
  this.hidDevice.write(commandBuffer);
};

exports.Device = Device;