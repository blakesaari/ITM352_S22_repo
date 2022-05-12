// --------------------------- Load Packages --------------------------- // 
    // Load Express Package
        var express = require('express');
        var app = express();

    // Lead Sessions Package
        var session = require('express-session');
        app.use(session({secret: "MySecretKey", resave: true, saveUninitialized: true}));

    // Load Cookies Package
        var cookieParser = require('cookie-parser');
        app.use(cookieParser());

    // Load Page Body
        app.use(express.urlencoded({ extended: true }));

    // Initialize Filesync
        const fs = require("fs");

// ------------------- Initialize Public Directory ------------------- // 
    app.use(express.static(__dirname + '/public'));

// -------------------------- Load User Data ------------------------- // 
    var user_data_file = './public/data/user_data.json'       

        // Read User Data
            if (fs.existsSync(user_data_file)) {
                var user_data_string = fs.readFileSync(user_data_file, 'utf-8');
                // Parse data and output as string
                    var user_string = JSON.parse(user_data_string);
        // If file does not exist, output error to console
            } else {
                console.log(user_data_file `does not exist!`);
            }

// ------------------------ Load Product Data ------------------------ // 
    var product_data_file = './public/data/products.json'
            
        // Read User Data
        if (fs.existsSync(product_data_file)) {
            var product_data_string = fs.readFileSync(product_data_file, 'utf-8');
            // Parse data and output as string
            var product_string = JSON.parse(product_data_string);
        // If file does not exist, output error to console
        } else {
            console.log(user_data_file `does not exist!`);
        }
            

    
    // Get products data
    app.post("/get_products_data", function (request, response) {
        response.json(product_string);
    });

/*
app.get("/add_to_cart", function (request, response) {
    var products_key = request.query['products_key']; // get the product key sent from the form post
    var quantities = request.query['quantities'].map(Number); // Get quantities from the form post and convert strings from form post to numbers
    request.session.cart[products_key] = quantities; // store the quantities array in the session cart object with the same products_key. 
    response.redirect('./cart.html');
});
*/

// Print all requests in console
app.all('*', function (request, response, next) {
    console.log(`Got a ${request.method} to path ${request.path}`);
    // Initialize an object to store the cart in the session
    if(typeof request.session.cart == 'undefined') { request.session.cart = {}; } 
    next();
});

// --------------------------- Shopping Cart --------------------------- //

    // Add product to cart in client's session
    app.post("/update_cart", function (request, response) {
        console.log(request.body);
        var prod_key = request.body.products_key;
        if(typeof request.session.cart == 'undefined') { 
                request.session.cart = {}; 
            } 
        request.session.cart[prod_key] = request.body.quantities;
        console.log(request.session)
        response.redirect(`./store.html?products_key=${prod_key}`);
    });

    // Request cart data from client's session
    app.post("/get_cart", function (request, response) {
        response.json(request.session.cart);
    });


// -------------------------------- Log-in --------------------------------- //
    app.post("/login", function(request, response) {

        console.log(request.sessionID)
        const { username, password } = req.body;

    })

// Listening on port 8080
    app.listen(8080, () => console.log(`listening on port 8080`));




// ------------------------------ Functions ------------------------------- //

    // Determines valid quantity
        function isNonNegInt(q, return_errors = false) {
            errors = []; // assume no errors at first
            if (q == '') q = 0; // handle blank inputs as if they are 0
            if (Number(q) != q) errors.push('<b><font color="red">Not a number!</font></b>'); // Check if string is a number value
            if (q < 0) errors.push('<b><font color="red">Negative value!</font></b>'); // Check if it is non-negative
            if (parseInt(q) != q) errors.push('<b><font color="red">Not an integer!</font></b>'); // Check that it is an integer
            return return_errors ? errors : (errors.length == 0);
        };
    // Determines input in textbox
        function checkQuantityTextbox(qtyTextbox) {
            errs = isNonNegInt(qtyTextbox.value, true);
            if (errs.length == 0) errs = ['Want to purchase: '];
            if (qtyTextbox.value.trim() == '') errs = ['Type desired quantity: '];
            document.getElementById(qtyTextbox.name + '_label').innerHTML = errs.join('<font color="red">, </font>');
        };
