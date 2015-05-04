var http = require('http');
var process = require('../index.js').process;

var server = http.createServer();
var config = {
    targetHost: 'www.weibo.com',
    targetPort: 80
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