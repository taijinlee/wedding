var requirejs = require('requirejs');
var exec = require('child_process').exec;

var http = require('http');
http.createServer(function (req, res) {
  if (req.method === 'POST') {
    exec('git rev-parse --verify HEAD', function(error, stdout, stderror) {
      if (error) { return console.log(error); }
        
      requirejs.optimize(config, function (buildResponse) {
        console.log(buildResponse);

        exec('make dev', function(error, stdout, stderror) {
          if (error) { return console.log(error); }
        });
      });
    });
  } 
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Done');

}).listen(2222);
console.log('Server running on port 2222');