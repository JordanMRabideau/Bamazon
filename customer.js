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
    connection.query("SELECT * FROM products", showProducts)
}

function showProducts(err, table) {
    var productArray = [];

    if (err) throw err;

    for (var i = 0; i < table.length; i++) {
        var product = {
            name: table[i].product_name + " | Department: " + table[i].department_name + 
            " | Price: $" + table[i].price + " | Stock: " + table[i].stock,
            value: table[i].id
        };
        productArray.push(product);
    };

    productArray.push({
        name: "Back",
        value: 0
    })

    inquirer.prompt({
        name:"productChoice",
        type: "list",
        message: "Select an item you would like to order",
        choices: productArray,
        pageSize: 15,
    }).then(function(answer) {
        var productId = answer.productChoice;
        if (productId == 0) {
            runBamazon
        } else {
            purchaseItem(productId)
        }
            
    })
}

function purchaseItem(id) {
    connection.query("SELECT stock FROM products WHERE ?", 
    {
        id: id
    }, function(error, stockNum) {
        if (error) throw error;
        inquirer.prompt({
            name: "amount",
            type: "input",
            message: "How many would you like to order?",
        }).then(function(ans){
            updateDatabase(ans, stockNum, id)
        })
    })
}           

function updateDatabase(ans, stockNum, id) {
    var quant = parseInt(ans.amount);
    if (Number.isInteger(quant) && quant <= stockNum[0].stock && quant > 0) {
        var newStock = stockNum[0].stock - quant;
        // console.log("Original stock: " + res[0].stock + "\nNew stock: " + newStock);
        connection.query("UPDATE products SET ? WHERE?",
        [
            {
                stock: newStock
            },
            {
                id: id
            }
        ]);
        console.log("\nThank you for shopping at Bamazon! Your order will arrive within the next 2 to 3 days." + 
        "\nYou Will now be redirected to the start menu.\n")
        showAll()
    } else if (quant == 0) {
        console.log("Please enter a value greater than 0");
        purchaseItem(id);
    }
}