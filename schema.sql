DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    id INT(100) AUTO_INCREMENT,
    PRIMARY KEY(id),
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(13,2) NOT NULL,
    stock INT(50) NOT NULL
);