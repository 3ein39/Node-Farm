var http = require('http');
var url = require('url');
var fs = require('node:fs');
var productsData = fs.readFileSync("".concat(__dirname, "/dev-data/data.json"), 'utf-8');
var productsDataObj = JSON.parse(productsData);
// read the template files
// they are read only once when starting the server
var product_template = fs.readFileSync("".concat(__dirname, "/templates/product.html"), 'utf-8');
var overview_template = fs.readFileSync("".concat(__dirname, "/templates/overview.html"), 'utf-8');
var card_template = fs.readFileSync("".concat(__dirname, "/templates/card.html"), 'utf-8');
var fillCard = function (data, template) {
    var output = template.replace(/{%IMAGE%}/g, data.image);
    output = output.replace(/{%PRODUCT_NAME%}/g, data.productName);
    output = output.replace(/{%PRICE%}/g, data.price);
    output = output.replace(/{%QUANTITY%}/g, data.quantity);
    output = output.replace(/{%ID%}/g, data.id);
    if (data.organic === false)
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    // console.log(output);
    return output;
};
var server = http.createServer(function (req, res) {
    var pathName = req.url;
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        var cardsHTML = productsDataObj.map(function (el) { return fillCard(el, card_template); }).join('');
        var output = overview_template.replace(/{%PRODUCT_CARDS%}/g, cardsHTML);
        res.end(output);
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
