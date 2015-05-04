var net = require('net');
var processSocket = require('../index.js').processSocket;

var server = net.createServer(function(socket) {
    processSocket(socket, {
        targetHost: '172.30.3.71',
        targetPort: 80
    });
});
server.listen(3000);