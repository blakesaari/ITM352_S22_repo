// --------------------------- Load Packages --------------------------- // 
    // Load Express Package
        var express = require('express');
        var app = express();

    // Lead Sessions Package
        var session = require('express-session');
        // Set session and expiration
        app.use(session({secret: "MySecretKey", resave: true, saveUninitialized: true, maxAge: Date.now() + 86400 * 500}));

    // Load Cookies Package
        var cookieParser = require('cookie-parser');
        app.use(cookieParser());

    // Load Page Body
        app.use(express.urlencoded({ extended: true }));

    // Initialize Filesync
        const fs = require("fs");

    // Load Nodemailer
        var nodemailer = require('nodemailer');
const { request } = require('http');
const res = require('express/lib/response');

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
    var products_data = './public/data/products.json'
            
        // Read Product Data
        if (fs.existsSync(products_data)) {
            var product_data_string = fs.readFileSync(products_data, 'utf-8');
            // Parse data and output as string
            var product_string = JSON.parse(product_data_string);
        // If file does not exist, output error to console
        } else {
            console.log(products_data `does not exist!`);
        }
        
        // Initialize quantity data
        Array.from(product_string).forEach((name,i)=>{name.quantity_available = product_string[i].quantity_available})
    
        // POST for products data
        app.post("/get_products_data", function (request, response) {
            response.json(product_string);
        });

// ------------------------ Session User Data ----------------------- // 
    app.post("/pull_userinfo", function (request, response) {
        var user_info = {};
            if(typeof request.session.loginID != 'undefined') {
                user_info.email = request.session.loginID;
                user_info.fullname = user_string[request.session.loginID].fullname;
            }
        console.log(user_info)    
    })


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
            var prod_key = request.body.products_key[1];
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

    // Go to cart
        app.post("/go_to_cart", function (request, response) {
            if (request.session.cart != null) {
                response.redirect('./cart.html');
            }
            else {
                console.log(request.session.cart);
                var prod_key = request.body.products_key;
                response.write('You have no items in your cart!');
                response.redirect(`./store.html?products_key=${prod_key}`);
            }
        })

    // Delete entire cart
        app.post("/delete_entire_cart", function (request, response) {
            request.session.cart = 0;
            console.log(request.session.cart);
            response.redirect('./index.html')
        })

    // Delete item within cart
        app.post("/delete_in_cart", function(request, response) {
            console.log('delete_in_cart', request.body);
            request.session.cart[request.body.pkey][request.body.pindex] = '';
            console.log(request.session.cart);
            //if (request.session.cart = '') {
            //    response.redirect('./index.html');
            //}
            response.redirect('back');
        })
        

// -------------------------------- Log-in --------------------------------- //

    // File I/O Exercise 4
        app.post("/login", function(request, response) {
        // Print body in console
            console.log(request.body);
        // Force submitted email into lowercase
            let submitted_email = request.body.email.toLowerCase();
            // If username exists -> Check if password matches -> Session LoginID becomes email
                if (typeof user_string[submitted_email] != 'undefined') {
                    if (user_string[submitted_email].password == request.body.password) {
                        request.session.loginID = submitted_email;
                        response.redirect(`./index.html`)
                    } else {
                        response.send(`Password incorrect!`);
                }}
                    else {
                        response.send(`Email is not registered yet!`)
                    }
        // Print Session LoginID in console
            console.log(request.session.loginID)
            });

            // Request user data from client's session
                app.post("/get_user_data", function (request, response) {
                    if (typeof request.session.loginID == 'undefined') {
                        request.session.loginID = null;
                    }
                    response.json(request.session.loginID);
                });

// -------------------------------- Log-out --------------------------------- //
        app.get("/log_out",(request, response)=>{
            if (request.session.loginID) {
                delete request.session.loginID;
            }
            response.redirect("/index.html");
            });

// ----------------------------- Registration ------------------------------ //
        app.post("/registration", function (request, response) {
            // Start with 0 errors
            var registration_errors = {};
            // Import email address from submitted page
            var registration_email = request.body['email'].toLowerCase();
            // Import password from submitted page
            var registration_password = request.body['password'];
            // Import repeat password from submitted page
            var registration_repeat_password = request.body['repeat_password'];
            // Import full name from submitted page
            var registration_fullname = request.body['fullname'];
            // Validate that there is an input in the email address field
            if (registration_email.length == 0) {
                registration_errors['email'] = `Please enter an email address!`;
            }
            // Validate email address is in correct format (CREDIT: W3Resource - Email Validation)
            else if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(request.body.email) == false) {
                registration_errors['email'] = `Please enter a valid email address (E.x. johndoe@gmail.com)`;
            }
            // Validate that the email address has not already been registered
            if (typeof user_string[registration_email] != 'undefined') {
                registration_errors['email'] = `The email account entered has already been registered, please try to login.`;
            }
            // Validates that the password entered is at least 8 characters
            if (registration_password == 0) {
                registration_errors['password'] = `Please enter a password`;
            }
            else if (registration_password < 8) {
                registration_errors['password'] = `Your password must be at least 8 characters`;
            }
            // Validates that password and repeat password match
            if (registration_password != registration_repeat_password) {
                registration_errors['repeat_password'] = `The passwords you entered do not match, please try again`
            }
            // Validates that the full name consists of a-z and A-Z characters exclusively 
            if (/^[A-Za-z, ]+$/.test(registration_fullname)) {
             } else { registration_errors['fullname'] = `Please enter your first and last name`;
            }
            if (registration_fullname > 30) {
                registration_errors['fullname'] = `Please enter a name less than 30 characters`
            } 

            // Reading and writing user info to a JSON (CREDIT: Assignment 2 Code Examples)
            if(Object.keys(registration_errors).length == 0) {
                user_string[registration_email] = {};
                user_string[registration_email].password = registration_password;
                user_string[registration_email].fullname = registration_fullname;
                fs.writeFileSync(user_data_file, JSON.stringify(user_string));
                console.log("Saved: " + user_string[registration_email]);
                request.session.loginID = registration_email;
                response.redirect('./index.html')
            } else {
                response.send(registration_errors);
            }
        });

// ----------------------------- Purchase ------------------------------ //
        app.post("/submit_order", function (request, response) {
            // Still need to  remove quantities from quantities available
            var quantities = request.session.cart;
            console.log(quantities);
                
            request.session.destroy();
            response.redirect("./index.html");
        })

// ---------------------- Review System (Stars) ---------------------- //
    app.post("/submit_review", function (request, response) {
        console.log(request.body);
        var products_index = Number(request.body.product_reviewed_index);
        if (typeof products_data[products_index].reviews == 'undefined') {
            products_data[products_index].reviews = [];
        }
        products_data[products_index].reviews.push({"rating": request.body.star})
        response.redirect('back');
    })

// ------------------------ Listening on Port 8080 ------------------------ //
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
