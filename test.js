var http = require('http');
var process = require('./index.js');

var server = http.createServer();
var config = {
    targetHost: '172.30.3.195',
    targetPort: 80,
    hostname: 'tsgw.shgt.com'
};

server.listen(3000);
server.on('listening', function() {
    console.log('the server is listening on port 3000!');
});
server.on('request', function(request, response) {
    process(request, response, {
        targetHost: config.targetHost,
        targetPort: config.targetPort
    });
});