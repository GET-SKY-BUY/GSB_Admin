require("dotenv").config();
const express = require("express");
const Products_Assistant = express.Router();
module.exports = Products_Assistant;
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
Products_Assistant.use(bodyParser.json());
Products_Assistant.use(bodyParser.urlencoded({ extended: true }));
Products_Assistant.use(cookieParser(process.env.COOKIE_SECRET));


// Product Assistant Home
Products_Assistant.get("/", (req, res) => {
    res.status(200).render("Product_Assistant_Home");
});

