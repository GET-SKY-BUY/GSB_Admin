require("dotenv").config();
const express = require("express");
const Sellers_Store = express.Router();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
Sellers_Store.use(bodyParser.json());
Sellers_Store.use(bodyParser.urlencoded({ extended: true }));
Sellers_Store.use(cookieParser(process.env.COOKIE_SECRET));

module.exports = Sellers_Store;





