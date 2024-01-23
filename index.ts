const http = require('http');
const url = require('url');
const fs = require('node:fs');


const productsData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productsDataObj = JSON.parse(productsData);
// read the template files
// they are read only once when starting the server
const product_template = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const overview_template = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const card_template = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');

const fillCard = (data, template) => {
    let output = template.replace(/{%IMAGE%}/g, data.image);
    output = output.replace(/{%PRODUCT_NAME%}/g, data.productName);
    output = output.replace(/{%PRICE%}/g, data.price);
    output = output.replace(/{%QUANTITY%}/g, data.quantity);
    output = output.replace(/{%ID%}/g, data.id);

    if (data.organic === false)
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    // console.log(output);
    return output;
}

const server =  http.createServer((req, res) => {
    const pathName = req.url;

    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHTML = productsDataObj.map(el => fillCard(el, card_template)).join('');
        const output = overview_template.replace(/{%PRODUCT_CARDS%}/g, cardsHTML);
        res.end(output);
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


