var requirejs = require('requirejs');
var fs = require('fs');
var exec = require('child_process').exec;

var http = require('http');
http.createServer(function (req, res) {
  console.log(req);
  if (req.method === 'POST') {
    exec('git pull --rebase', function(error, stdout, stderror) {
      if (error) { return console.log(error); }
      console.log("Git pulled latest code");
      exec('./node_modules/forever/bin/forever stop app/server.js', function(error, stdout, stderror) {
        if (error) { return console.log(error); }
        console.log("forever stopped app/server.js");
	exec('./node_modules/forever/bin/forever start -l /service/log/forever.log -o /service/log/app.log -e /service/log/app-stderr.log -p /service/tmp --append app/server.js', function (error, stdout, stderror) {
          if (error) { return console.log(error); }
          console.log("forever started app/server.js");
        });
      });
    });
  } 
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Done');
}).listen(2222);
console.log('Server running on port 2222');