// This function asks the server for a "service" and converts the response to text. 
function loadJSON(service, callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('POST', service, false);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 // This function makes a navigation bar from a products_data object
function nav_bar(this_products_key, products_data) {
    // This makes a navigation bar to other product pages
    for (let products_key in products_data) {
        if (products_key == this_products_key) continue;
        document.write(`<li><a href='./store.html?products_key=${products_key}'>${products_key}<a>&nbsp&nbsp&nbsp;</li>`);
    }
}

// Rating Function (Professor Port's Example)
function star_rate(rate) {
    // Based on the value, mark stars checked
    btn = document.getElementById("star_" + rate);
    console.log(document.getElementById("star_"+ rate));
    btn.checked = true;
    // Display correct rate stars
    var star = document.getElementById("star_" + rate).className;
    console.log(star)

    if (star == "empty_star") {
        for (i = rate; i > 0; i--) {
            document.getElementById("star" + i).className = "full_star";
        }
    }
    else if (star == "full_star") {
        for (i = rate; i < 5; i++) {
            document.getElementById("star" + (i+1)).className = "empty_star";
        }
    }
}