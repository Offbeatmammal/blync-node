//app.js
// Load the built in 'http' library
var http = require('http'); 
var util = require('util');
var querystring = require('querystring');

Blync = require('./blync');
var device = Blync.getDevice(0);

process.on( 'SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    // some other closing procedures go here
    device.sendCommand(0, 0, 0,false, false)
    process.exit( );
  })

  function processPost(request, response, callback) {
    var queryData = "";
    if(typeof callback !== 'function') return null;

    if(request.method == 'POST') {
        request.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            request.post = querystring.parse(queryData);
            callback();
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

// Create a function to handle every HTTP request
function handler(request, response){

    form = "<form action='/' method='post'>\n"+
    "Blink:<select id='color' name='color'><option value='160,32,240'>Purple</option><option value='0,0,128'>Blue</option><option value='0,128,0'>Green</option><option value='128,0,0'>Red</option></select>\n"+
    "<br><select id='blink' name='blink'><option value='0'>Steady</option><option value='1'>Slow</option><option value='2'>Medium</option><option value='3'>Fast</option></select>\n"+
    "<br><input type='submit'></form>\n"
    script = "<script>\n" +
    "function formSel(id,val) {\n" +
    "        x = document.getElementById(id)\n" +
    "    for (i = 0; i < x.length; i++) {\n" +
    "        if (x.options[i].value == val) {\n" +
    "            x.options[i].selected = true\n" +
    "        }\n" +
    "    }\n" +
    "}\n" +
    "</script>\n"
    console.log(script)
    if (request.method == "GET") { 
        response.setHeader('Content-Type', 'text/html');
        response.writeHead(200);
        response.write("<html><body>")
        response.end(form + "</body></html>");
    } else if (request.method == 'POST') {
        processPost(request, response, function() {
            // Use request.post.x here
            var blink = (request.post.blink);
            var color = (request.post.color)
            var colors = color.split(",");
            device.sendCommand((colors[0]), (colors[1]), (colors[2]),false,blink);
            response.setHeader('Content-Type', 'text/html');
            response.writeHead(200);
            response.write("<html><body>");
            defaults = "<script>\n"+
                "formSel('color','"+ color +"');\n"+
                "formSel('blink','"+ blink +"');\n"+
                "</script>\n"
            response.end(script + form +defaults +"</body></html>");
        });
    
    } else {
        response.writeHead(200);
        response.end();
    };
};

// Create a server that invokes the `handler` function upon receiving a request
// And have that server start listening for HTTP requests
// The callback function is executed at some time in the future, when the server
// is done with its long-running task (setting up the network and port etc)
http.createServer(handler).listen(3000, function(err){
  if(err){
    console.log('Error starting http server');
  } else {
    console.log('Server listening on port 3000');
  };
});