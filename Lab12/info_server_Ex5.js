// Load packages
var express = require('express');
var app = express();

// Load Body
app.use(express.urlencoded({ extended: true }));

 // Check if negative intergers exist
 function isNonNegInt(q, returnErrors = false) {
    errors = []; // Assumes no errors
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number
    else {
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an interger!'); // Check that it is an interger
        }
    return (returnErrors ? erorrs : (errors.legnth == 0));
}

// Respond to any request for any path
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});

// Get products data
var products = require(__dirname + '/product_data.json');

// Keep track of products sold
products.forEach( (prod,i) => {prod.total_sold = 0});

app.get("/product_data.js", function (request, response, next) {
   response.type('.js');
   var products_str = `var products = ${JSON.stringify(products)};`;
   response.send(products_str);
});


// Respond to a POST request
app.post("/process_form", function (request, response) {
    function isNonNegInt(q, returnErrors = false) {
        errors = []; // assume no errors at first
        if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
        else {
            if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
            if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
        }
        return (returnErrors ? errors : (errors.length == 0));
    }
    let brand = products[0]['brand'];
    let brand_price = products[0]['price'];
    var q = request.body['quantity_textbox'];
    if (typeof q != 'undefined') {
    response.redirect('receipt.html?quantity=' + q);
    } else {
        response.redirect(`order_page.html` + '?error=Invalid%20Quantity&quantity_textbox=' + q);
    } 
 }); 

// Respond to a GET request
app.get('/test', function (request, response, next) {
    response.send('In test:' + request.method + ' to path ' + request.path);
});

// In current directory -> look at public
app.use(express.static(__dirname + '/public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback

