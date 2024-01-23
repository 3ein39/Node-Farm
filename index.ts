const http = require('http');
const url = require('url');
const fs = require('node:fs');


const productsData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');


const server =  http.createServer((req, res) => {
    const pathName = req.url;

    if (pathName === '/' || pathName === '/overview') {
        res.end(`Welcome to OVERVIEW page`);
    }
    else if (pathName === '/products') {
        res.end(`Welcome to PRODUCTS page`)
    }
    else if (pathName === '/api') {
            res.writeHead(200, {'Content-type' : 'application/json'});
            res.end(productsData);
    }
    else {
        res.writeHead(404);
        res.end('wrong path')
    }

});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});


