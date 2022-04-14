// Based on Momoka Michimoto's (Fall 2021) server.js 

// Determines valid quantity (If "q" is a negative interger)
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


// Load Product Data
    var products = require(__dirname + '/products.json');
    // Initialize Quantity
        products.forEach((prod,i)=>{prod.quantity_available = products[i].quantity_available})
// Load Packages

    // Load Express Package
        var express = require('express');
        var app = express();
    
    // Load File System Package
        var fs = require('fs')

    // Load Body-Parser Package
        var parser = require("body-parser");
    
    // Load QueryString Package
        const qs = require('querystring');
        const { response } = require('express');

// Load User Data
    var user_data = require(__dirname + '/public/data/user_data.json');
    // Store Purchase Data
        var quantity_data = {};

// Taken from Lab 14
if (fs.existsSync(user_data)) {
    // have reg data file, so read data and parse into user_data_obj
    var data = fs.readFileSync(user_data, 'utf-8'); // read the file and return its content.
    var users_data = JSON.parse(data);
} else {
    console.log(user_data + ' does not exist!');
}

// Get Body
    app.use(parser.urlencoded({extended: true}));

// Monitor all requests

    app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
    });

// Process purchase request (validate quantities, check quantity available)

    app.post("/purchase", function(request, response, next) {
        var quantities = request.body['quantity'];
        var errors = {};
        var available_quantity = false;

        for (i in quantities) {
            if (isNonNegInt(quantities[i]) == false) {
                errors['quantity_' + i] = `Submit a valid quantity for ${products[i].item}!`
            }
            if (quantities[i] > 0) {
                available_quantity = true;
            }
            if (quantities[i] > products[i].quantity_available) {
                errors['available_' + i] = `We don't have ${(quantities[i])} ${products[i].item} ready to ship, order less or check our stock later!`
            }
        }

    if (!available_quantity) {
        errors['No quantities inputted'] = `Please enter a quantity for steaks!`;
    }

    let quantity_object = { "quantity" : JSON.stringify(quantities)};
    console.log(Object.keys(errors));
        if (Object.keys(errors).length == 0) {
        for (i in quantities) {
            products[i].quantity_available -= Number(quantities[i]);
        }
        response.redirect('./login.html?' + qs.stringify(quantity_object));
    }
        else {
            let errors_obj = { "errors": JSON.stringify(errors) };
            console.log(qs.stringify(quantity_object));
            response.redirect('./store.html?' + qs.stringify(quantity_object) + '&' + qs.stringify(errors_obj));
        }
    });

//--------Login Page Processing--------

    // Process Login
    app.post("/login_process", function (request, response) {
        // Process login and redirect if logged in, return to login if failed
        var user_email = request.body['email'].toLowerCase();
        var user_password = request.body['password'];
        var errors = {};
        
        if (typeof users_data[user_email] != 'undefined') {
            if (users_data[user_data].password == user_password) {

                quantity_data['email'] = user_email;
                quantity_data['name'] = users_data[user_email].name

                let params = new URLSearchParams(quantity_data)

                response.redirect('./invoice.html?' + params.toString());
                return;
            } else {
                errors['login_erorr'] = `Wrong password!`;
            }
        }
            else {
                errors['login_erorr'] = `Wrong Email Address`;
            }

            // Redirect With Error Message
            let params = new URLSearchParams(errors);
            params.append('email', user_email);
            response.redirect(`./login.html?` + params.toString());
    });


// Routing 
    app.get("/products.json", function(request, response, next)
        {
            response.type('.js');
            var products_str = `var products = ${JSON.stringify(products)};`;
            response.send(products_str);
        });
    
// Route all other GET requests to files in public 
    app.use(express.static(__dirname + '/public'));

// Start server
    app.listen(8080, () => console.log(`listening on port 8080`));
