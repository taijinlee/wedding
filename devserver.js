var requirejs = require('requirejs');
var exec = require('child_process').exec;

var http = require('http');
http.createServer(function (req, res) {
  if (req.method === 'POST') {
    exec('git rev-parse --verify HEAD', function(error, stdout, stderror) {
      if (error) { return console.log(error); }
      var latestHash = stdout.trim();
      config.dir += '/' + latestHash;
        
      requirejs.optimize(config, function (buildResponse) {
        console.log(buildResponse);
        var versionedFiles = [config.dir + 'js/main.js', config.dir + 'layout.html'].join(' ');
            
        exec('find ' + versionedFiles + " -exec sed -i -e 's/VERSION/" + latestHash + "/g' {} \\;", function(error, stdout, stderror) {
          if (error) { return console.log(error); }
          console.log(versionedFiles + ' have VERSION substituted with ' + latestHash);
        });
      });
    });
  } 
  res.writeHead(200, {'Content-Type': 'text/plain'});

  res.end('Done');

}).listen(2222);
console.log('Server running on port 2222');