Blync = require('./blync');
var device = Blync.getDevice(0);

function wait(seconds=5) {
    var waitTill = new Date(new Date().getTime() + seconds * 1000);
    while(waitTill > new Date()){}
}

function exitHandler(options, err) {
	device.sendCommand(0, 0, 0,false, false)
    if (options.cleanup) console.log('clean exit');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

// set colors
r=128
g=0
b=128
// turn on the light
device.sendCommand(r, g, b,false,2);
wait(2);

// play some more
r=0
g=255
b=128
device.sendCommand(r, g, b,true,0);
wait(2);
device.sendCommand(r, g, b,false,0);
wait(2);
device.sendCommand(r, g, b,true,0);
wait(2);
// Note: the exit handler turns the lights off
