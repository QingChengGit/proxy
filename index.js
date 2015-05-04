var http = require('http'), https = require('https');
var url = require('url');
/**
 * 代理请求
 * @param  {[HttpRequest]}  request       请求
 * @param  {[HttpResponse]} response      响应
 * @param  {[Object]}       opts          类似于：{targetHost: '', targetPort: '', kind: 'http' or 'https'}
 * @param  {[Function]}     errorCallback 错误回调函数
 */
function process(request, response, opts, errorCallback) {
    var opts = opts || {};
    if (!opts.targetHost) throw new TypeError('need target host');
    opts.targetPort = opts.targetPort || 80;

    var options = {
        hostname: opts.targetHost,
        port: opts.targetPort,
        path: request.url,
        method: request.method,
        headers: request.headers
    };

    // 伪装头部
    options.headers['host'] = opts.targetHost + ':' + opts.targetPort
    options.headers['Remote Address'] = opts.targetHost + ':' + opts.targetPort;
    options.headers['Request URL'] = opts.targetHost + ':' + opts.targetPort + request.url;

    var req = (opts.kind === 'https' ? https.request : http.request)(options, function(res) {
        // 处理重定向问题
        if (res.headers.location) {
            var parseObject = url.parse(res.headers.location);
            res.headers.location = parseObject.path;
        }
        response.writeHead(res.statusCode, res.headers);

        res.on('data', function (chunk) {
            response.write(chunk);
        });
        res.on('end', function() {
            response.end();
        });
    });

    if (request.method === 'POST') {
        request.on('data', function(data) {
            req.write(data);
        }).on('end', function() {
            req.end();
        });
    } else if (request.method === 'GET') {
        req.end();
    }

    req.on('error', function(e) {
        errorCallback instanceof Function && errorCallback(e);
    });
}


var net = require('net');
function processSocket(socketClient, opts, errorCallback) {
    net.connect({
        host: opts.targetHost,
        port: opts.targetPort,
        localAddress: socketClient.localAddress,
        localPort: socketClient.localPort,
        family: 4
    }, function(socket) {
        socketClient.on('data', function(data) {
            socket.write(data);
        });
        socketClient.on('end', function() {
            socket.end();
        });

        socket.on('data', function(data) {
            socketClient.write(data);
        });
        socket.on('end', function() {
            socketClient.end();
        });
    });
}

module.exports = {
    process: process,
    processSocket: processSocket
};






