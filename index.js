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

    var req = http.request(options, function(res) {
        response.writeHead(res.statusCode, res.headers);
        res.on('data', function (chunk) {
            response.write(chunk);
            response.end();
        });
    });

    if (request.method === 'POST') {
        request.on('data', function(data) {
            req.write(data);
            req.end();
        });
    } else if (request.method === 'GET') {
        req.end();
    }

    req.on('error', function(e) {
        errorCallback instanceof Function && errorCallback(e);
    });
}

module.exports = process;






