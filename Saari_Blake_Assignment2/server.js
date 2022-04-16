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

    // Load Product Data
        var products = require(__dirname + '/products.json');
        // Initialize Quantity
            products.forEach((prod,i)=>{prod.quantity_available = products[i].quantity_available})

    // Load User Data
        var filename = './public/data/user_data.json';

        // Store Data from Purchase
            var qty_obj = {};
    
    // Load Body
        app.use(express.urlencoded({extended: true}));

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

// ---------------------------- Purchase -------------------------------- // 
// Processing Purchase Request (Validates Quantities & Checks Availability)
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
        if (Object.keys(errors).length == 0) {
        for (i in quantities) {
            products[i].quantity_available -= Number(quantities[i]);
        }
        qty_data_obj = quantity_object
        response.redirect('./login.html');
    }
        else {
            let errors_obj = { "errors": JSON.stringify(errors) };
            console.log(qs.stringify(quantity_object));
            response.redirect('./store.html?' + qs.stringify(quantity_object) + '&' + qs.stringify(errors_obj));
        }
    });

// ---------------------------- Log-in -------------------------------- // 

if (fs.existsSync(filename)) {
    // Lab 13 Example
    var data_str = fs.readFileSync(filename, 'utf-8');
    var user_str = JSON.parse(data_str);
}
else {
    console.log(filename + ' does not exist.');
}


// Processing Login Request
    app.post("/process_login", function (request, response) {
        // Process login form POST and redirect to logged in page if ok, back to login page if not
        var the_email = request.body['email'].toLowerCase();
        var the_password = request.body['password'];

        if (typeof user_str[the_email] != 'undefined') {
            if (user_str[the_email].password == the_password) {
                qty_data_obj['email'] = the_email;
                qty_data_obj['fullname'] = user_str[the_email].name;
                let params = new URLSearchParams(qty_data_obj);
                console.log(qty_data_obj)
                response.redirect('./invoice.html?' + params.toString());
                return;
            } else {
                response.send(`Wrong password!`);
            }
            return;
        }
        response.send(`${the_email} does not exist`);
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