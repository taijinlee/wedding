var async = require('async');
var exec = require('child_process').exec;
var http = require('http');

http.createServer(function(req, res) {
  if (req.method === 'POST') {
    async.series([
      function(callback) {
        exec('git pull --rebase', function(error, stdout, stderror) {
          if (error) { return callback(error); }
          console.log("Git pulled latest code");
          return callback(null);
        });
      },
      function(callback) {
        exec('./node_modules/forever/bin/forever stop app/server.js', function(error, stdout, stderror) {
          if (error) { return callback(error); }
          console.log("forever stopped app/server.js");
          return callback(null);
        });
      },
      function(callback) {
        exec('./node_modules/forever/bin/forever start -l /service/log/forever.log -o /service/log/app.log -e /service/log/app-stderr.log -p /service/tmp --append app/server.js', function (error, stdout, stderror) {
          if (error) { return callback(error); }
          console.log("forever started app/server.js");
          return callback(null);
        });
      },
    ], function (error, result) {
      if (error) { console.log(error); }
    });
  }
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Done');
}).listen(2222);
console.log('DevServer running on port 2222');
