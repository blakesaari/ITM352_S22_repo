var express = require('express');
var app = express();

var session = require('express-session');
var products_data = require(__dirname + '/products.json');

console.log(products_data);

app.use(express.urlencoded({ extended: true }));
app.use(session({secret: "MySecretKey", resave: true, saveUninitialized: true}));

app.all('*', function (request, response, next) {
    console.log(`Got a ${request.method} to path ${request.path}`);
    // need to initialize an object to store the cart in the session. We do it when there is any request so that we don't have to check it exists
    // anytime it's used
    if(typeof request.session.cart == 'undefined') { request.session.cart = {}; } 
    next();
});

app.post("/get_products_data", function (request, response) {
    response.json(products_data);
});

/*
app.get("/add_to_cart", function (request, response) {
    var products_key = request.query['products_key']; // get the product key sent from the form post
    var quantities = request.query['quantities'].map(Number); // Get quantities from the form post and convert strings from form post to numbers
    request.session.cart[products_key] = quantities; // store the quantities array in the session cart object with the same products_key. 
    response.redirect('./cart.html');
});
*/

app.post("/update_cart", function (request, response) {
    console.log(request.body);
    var prod_key = request.body.products_key;
    if(typeof request.session.cart == 'undefined') { 
            request.session.cart = {}; 
        } 
    request.session[prod_key] = request.body.quantities;
    console.log(request.session)
    response.redirect(`./store.html?products_key=${prod_key}`);
});

app.post("/get_cart", function (request, response) {
    response.json(request.session.cart);
});

app.use(express.static(__dirname + '/public'));
app.listen(8080, () => console.log(`listening on port 8080`));



// Invoice

app.get("/checkout", function (request, response) {
    var invoice_str = `Thank you for your order!<table border><th>Quantity</th><th>Item</th>`;
    var shopping_cart = request.session.cart;
for(prod_key in products_data) {
    for(i=0; i<products_data[prod_key].length; i++) {
        if(typeof shopping_cart[prod_key] == 'undefined') continue;
        qty = shopping_cart[prod_key][i];
        if(qty > 0) {
          invoice_str += `<tr><td>${qty}</td><td>${products_data[prod_key][i].name}</td><tr>`;
        }
    }
}
invoice_str += '</table>';});