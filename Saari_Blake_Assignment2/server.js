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
        var filename = require('./public/data/user_data.json');

        // Store Data from Purchase
        var qty_obj = {};
    
    // Load Body
        app.use(parser.urlencoded({extended: true}));

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
        var errors = {};
        var the_email = request.body['email'].toLowerCase();
        var the_password = request.body['password'];

            if (typeof user_str[the_email] != 'undefined') {
                if (user_str[the_email].password == the_password) {
                    qty_obj['email'] = the_email;
                    qty_obj['fullname'] = user_str[the_email].name;

                    let params = new URLSearchParams(qty_obj);
                    response.redirect('./invoice.html?' + params.toString());
                    return;
                } else {
                    errors['login_error'] = `Incorrect Password!`;
                }
            } else {
                errors['login_error'] = `Incorrect E-Mail Address!`;
            }
            let params = new URLSearchParams(errors);
            params.append('email', data_str);
            response.redirect('./login.html' + params.toString());
    });

// ---------------------------- Register -------------------------------- // 
    app.post("/process_registration", function(req, res){
        console.log(request.body)

        var registration_errors = {};
        var registration_email = request.body['email'].toLowerCase();
        var reigstration_password = request.body['password'];


        // Name Validation
        if(/^[A-Za-z, ]+$/.test(req.body.name)) {    
        }
        else {
            registration_errors['name'] = `Only a-z characters allowed.`;
        }

        // Email Validation
        if(ValidateEmail.test(registration_email)) {
        }
        else {
            registration_errors['email'] = `Must enter a valid email address.`;
        }

        // Password Validation
        if(reigstration_password < 6) {
            registration_errors['password'] = `Minimum 6 character password.`
        }

            // Repeat Password Validation
            if (reigstration_password != req.body.repeat_password) {
                registration_errors[repeat_password] = 'Passwords do not match!';
            }

        if (object.keys(registration_errors).length == 0) {
            console.log('No errors')
            var email = registration_email;
            user_str[registration_email] = {};
            user_str[registration_email] = request.body.password;
            user_str[registration_email].name = request.body.fullname;

            fs.writeFileSync(filename, JSON.stringify(user_str), "utf-8");

            qty_obj['email'] = registration_email
            qty_obj['fullname'] = user_str[registration_email].name;
            let params = new URLSearchParams(qty_obj);
            response.redirect('./invoice.html' + params.toString());
        } else {
            request.body['registration_errors'] = JSON.stringify(registration_errors);
            let params = new URLSearchParams(request.body);
            response.redirect("./registration.html?" + params.toString());
        }
    });

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
    console.log(Object.keys(errors));
        if (Object.keys(errors).length == 0) {
        for (i in quantities) {
            products[i].quantity_available -= Number(quantities[i]);
        }
        qty_obj = quantity_object
        response.redirect('./login.html?');
    }
        else {
            let errors_obj = { "errors": JSON.stringify(errors) };
            console.log(qs.stringify(quantity_object));
            response.redirect('./store.html?' + qs.stringify(quantity_object) + '&' + qs.stringify(errors_obj));
        }
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