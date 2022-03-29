var company = "The Meatlocker";
var address = "4718 Kaimuki Ave.";
var city = "Honolulu";
var state = "HI";
var zipcode = 96816;

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;


var due = new Date();
var numberofDaysToAdd = 7;
var result = due.setDate(due.getDate()+numberofDaysToAdd);
var dd = String(due.getDate()).padStart(2, '0');
var mm = String(due.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = due.getFullYear();

due_date = mm + '/' + dd + '/' + yyyy;
