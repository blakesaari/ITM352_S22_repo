var attributes = "Blake;21;20.5;-20.5";
var parts_array = attributes.split(";");

parts_array.forEach(checkIt);
parts_array.forEach((item, index) => {console.log(`part ${index} is ${(AreStringsNonNegInt(item) ? 'a':'not a')}quantity`);})

// The function allows us to check whether or not a string is not a number, has a negative value, and is an integer.
function AreStringsNonNegInt(q, returnErrors=false) 
    {
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return (returnErrors ? errors : (errors.length == 0));
    }
function checkIt (item, index) 
    {
    console.log(`part ${index} is ${(AreStringsNonNegInt(item)?'a':'not a')} quantity`);
    }