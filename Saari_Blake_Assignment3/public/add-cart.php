<?php

$conn = mysqli_connect("localhost:8889", "root", "root", "classicmodels");

$quantity = $_POST["quantity"];
$productCode = $_POST["productCode"];

$cart = isset($_COOKIE["cart"]) ? $_COOKIE["cart"] : "[]";
$cart = 