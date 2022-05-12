var express = require('express');
var app = express();
app.use(express.urlencoded({extended:true}));


app.get('/', function(req,res) {
    res.send(
        `<form action="/process_form" method="POST">
            Name 1: <input  name="name 1"><br>
            Name 2: <input  name="name 2"><br>
            <input type="submit" name="Submit" value="Send POST Request">
        </form>`
        );
});

app.post('/process_form', function(req, res) {
    console.log(req.body);
    if (typeof req.body['Submit'] != 'undefined') {
            if (req.body = 'Tyler') {
                res.send("Found him!");
            } else {
                res.send("I couldn't find Tyler :(");
            }
        }
        
});

app.listen(8080, () => console.log(`listening on port 8080`));