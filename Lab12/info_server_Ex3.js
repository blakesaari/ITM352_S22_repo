var express = require('express');
var app = express();

app.use(express.urlencoded({ extended: true }));

// Respond to any request for any path
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});

// Respond to a GET request
app.get('/test', function (request, response, next) {
    response.send('In test:' + request.method + ' to path ' + request.path);
});

// Respond to a POST request
app.post("/process_form", function (request, response, next) {
    var q = request.body['quantity_textbox'];
    if (typeof q != 'undefined') {
    response.send(`Thank you for purchasing ${q} things!`);
    } 
 }); 

// In current directory -> look at public
app.use(express.static(__dirname + '/public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback
