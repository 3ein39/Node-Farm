var http = require('http');
var url = require('url');
var fs = require('node:fs');
var productsData = fs.readFileSync("".concat(__dirname, "/dev-data/data.json"), 'utf-8');
var server = http.createServer(function (req, res) {
    var pathName = req.url;
    if (pathName === '/' || pathName === '/overview') {
        res.end("Welcome to OVERVIEW page");
    }
    else if (pathName === '/products') {
        res.end("Welcome to PRODUCTS page");
    }
    else if (pathName === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(productsData);
    }
    else {
        res.writeHead(404);
        res.end('wrong path');
    }
});
server.listen(8000, '127.0.0.1', function () {
    console.log('Listening to requests on port 8000');
});
