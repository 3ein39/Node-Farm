// Import necessary modules
var http = require('http');
var url = require('url');
var fs = require('node:fs');
// Read and parse the product data from the JSON file
var productsData = fs.readFileSync("".concat(__dirname, "/dev-data/data.json"), 'utf-8');
var productsDataObj = JSON.parse(productsData);
// Read the HTML templates for the product, overview, and card
var product_template = fs.readFileSync("".concat(__dirname, "/templates/product.html"), 'utf-8');
var overview_template = fs.readFileSync("".concat(__dirname, "/templates/overview.html"), 'utf-8');
var card_template = fs.readFileSync("".concat(__dirname, "/templates/card.html"), 'utf-8');
// Function to replace placeholders in the HTML templates with actual product data
var fillCard = function (data, template) {
    // Replace placeholders with actual data
    var output = template.replace(/{%IMAGE%}/g, data.image);
    output = output.replace(/{%PRODUCT_NAME%}/g, data.productName);
    output = output.replace(/{%PRICE%}/g, data.price);
    output = output.replace(/{%QUANTITY%}/g, data.quantity);
    output = output.replace(/{%ID%}/g, data.id);
    output = output.replace(/{%FROM%}/g, data.from);
    output = output.replace(/{%NUTRIENTS%}/g, data.nutrients);
    output = output.replace(/{%DESCRIPTION%}/g, data.description);
    // If the product is not organic, add 'not-organic' class
    if (data.organic === false)
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
};
// Create the server
var server = http.createServer(function (req, res) {
    // Parse the URL to get the path and query parameters
    var completeUrl = "http://".concat(req.headers.host).concat(req.url);
    var url = new URL(completeUrl);
    var pathName = url.pathname || '/';
    var productID = url.searchParams.get('id');
    var oh = 'wow';
    var oh2 = 'wow';
    // Handle different routes
    if (pathName === '/' || pathName === '/overview') {
        // Send the overview page
        res.writeHead(200, { 'Content-type': 'text/html' });
        // Generate HTML for each product card and insert it into the overview template
        var cardsHTML = productsDataObj.map(function (el) { return fillCard(el, card_template); }).join('');
        var output = overview_template.replace(/{%PRODUCT_CARDS%}/g, cardsHTML);
        res.end(output);
    }
    else if (pathName === "/product") {
        // Send the product page
        res.writeHead(200, { 'Content-type': 'text/html' });
        // Get the requested product and generate the product page HTML
        if (productID === null)
            productID = '0';
        var product = productsDataObj[productID];
        var output = fillCard(product, product_template);
        res.end(output);
    }
    else if (pathName === '/api') {
        // Send the raw product data as JSON
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(productsData);
    }
    else {
        // Send a 404 error for any other path
        res.writeHead(404);
        res.end('wrong path');
    }
});
// Start the server
server.listen(8000, '127.0.0.1', function () {
    console.log('Listening to requests on port 8000');
});
