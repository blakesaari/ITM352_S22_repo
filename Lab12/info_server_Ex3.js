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

// Respond to a POST request
app.post("/process_form", function (request, response) {
    var q = request.body['quantity_textbox'];
    console.log(q)
    if (typeof q != 'undefined') {
        response.send(`Thank you for purchasing ${q} things!`);
    } 
    else {
        response.send(`Error: ${q} is not a valid quantity. Please hit the back button and enter a positive number.`)
    }
 }); 

// Respond to a GET request
app.get('/test', function (request, response, next) {
    response.send('In test:' + request.method + ' to path ' + request.path);
});

// In current directory -> look at public
app.use(express.static(__dirname + '/public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback

