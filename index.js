var http = require('http');

var server = http.createServer();
var config = {
    targetHost: '115.29.233.12',
    targetPort: 80
};

server.listen(3000);
server.on('listening', function() {
    console.log('the server is listening on port 3000!');
});
server.on('request', function(request, response) {
    // 转发请求
    var options = {
        hostname: config.targetHost,
        port: config.targetPort,
        path: request.url,
        method: request.method,
        headers: request.headers
    };

    var req = http.request(options, function(res) {
        response.writeHead(res.statusCode, res.headers);
        res.on('data', function (chunk) {
            console.log(chunk);
            response.write(chunk);
            response.end();
        });
    });

    console.log('----------method:', request.method);
    console.log('----------headers:', request.headers);
    console.log('----------url:', request.url);

    if (request.method === 'POST') {
        request.on('data', function(data) {
            console.log(data);
            req.write(data);
            req.end();
        });
    } else if (request.method === 'GET') {
        req.end();
    }

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
});






