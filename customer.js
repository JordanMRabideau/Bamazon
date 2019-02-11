var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Willow945",
    database: "bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("Connected to database");
    runBamazon();
});

function runBamazon() {
    inquirer.prompt({
        name: "search",
        type: "list",
        message: "Please select an option",
        choices: [
            "See all items",
            "Search by department",
            "Exit Bamazon"
        ],
    }).then(function(answer){
        switch (answer.search) {
            case "See all items":
              showAll();
              break;
            
            case "Search by department":
              departmentSearch();
              break;

            case "Exit Bamazon":
              connection.end();
        };
    });
};

function showAll() {
    connection.query("SELECT * FROM products", function (err, res) {
        var productArray = [];

        if (err) throw err;
        // console.log(res);
        for (var i = 0; i < res.length; i++) {
           productArray.push(res[i].product_name + " | Department: " + res[i].department_name + 
           " | Price: $" + res[i].price + " | Stock: " + res[i].stock); 
        };
        inquirer.prompt({
            name:"productChoice",
            type: "list",
            message: "Select an item you would like to order",
            choices: productArray
        })
    })
}