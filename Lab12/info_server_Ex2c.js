var express = require('express');
var app = express();

// Respond to any request for any path
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});

// Respond to a GET request
app.get('/test', function (request, response, next) {
    response.send('In test:' + request.method + ' to path ' + request.path);
});

// In current directory -> look at public
app.use(express.static(__dirname + '/public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback
