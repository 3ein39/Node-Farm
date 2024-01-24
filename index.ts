// Import necessary modules
const http = require('http');
const url = require('url');
const fs = require('node:fs');

// Read and parse the product data from the JSON file
const productsData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productsDataObj = JSON.parse(productsData);

// Read the HTML templates for the product, overview, and card
const product_template = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const overview_template = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const card_template = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');

// Function to replace placeholders in the HTML templates with actual product data
const fillCard = (data, template) => {
    // Replace placeholders with actual data
    let output = template.replace(/{%IMAGE%}/g, data.image);
    output = output.replace(/{%PRODUCT_NAME%}/g, data.productName);
    output = output.replace(/{%PRICE%}/g, data.price);
    output = output.replace(/{%QUANTITY%}/g, data.quantity);
    output = output.replace(/{%ID%}/g, data.id);
    output = output.replace(/{%FROM%}/g, data.from);
    output = output.replace(/{%NUTRIENTS%}/g, data.nutrients);
    output = output.replace(/{%DESCRIPTION%}/g, data.description);

    // If the product is not organic, add 'not-organic' class
    if (data.organic === false)
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')

    return output;
}

// Create the server
const server =  http.createServer((req, res) => {
    // Parse the URL to get the path and query parameters
    const completeUrl = `http://${req.headers.host}${req.url}`;
    const url = new URL(completeUrl);
    const pathName = url.pathname || '/';
    const productID = url.searchParams.get('id');

    // Handle different routes
    if (pathName === '/' || pathName === '/overview') {
        // Send the overview page
        res.writeHead(200, {'Content-type': 'text/html'});

        // Generate HTML for each product card and insert it into the overview template
        const cardsHTML = productsDataObj.map(el => fillCard(el, card_template)).join('');
        const output = overview_template.replace(/{%PRODUCT_CARDS%}/g, cardsHTML);
        res.end(output);
    }
    else if (pathName === `/product`) {
        // Send the product page
        res.writeHead(200, {'Content-type': 'text/html'});

        // Get the requested product and generate the product page HTML
        const product = productsDataObj[productID];
        const output = fillCard(product, product_template);
        res.end(output)
    }
    else if (pathName === '/api') {
        // Send the raw product data as JSON
        res.writeHead(200, {'Content-type' : 'application/json'});
        res.end(productsData);
    }
    else {
        // Send a 404 error for any other path
        res.writeHead(404);
        res.end('wrong path')
    }

});

// Start the server
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});