require("dotenv").config();
const express = require("express");
const Sellers_Store = express.Router();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
Sellers_Store.use(bodyParser.json());
Sellers_Store.use(bodyParser.urlencoded({ extended: true }));
Sellers_Store.use(cookieParser(process.env.COOKIE_SECRET));

module.exports = Sellers_Store;

const { Sellers_Store_Login } = require("../Controllers_Page/Sellers_Store.js");

Sellers_Store.get("/login", Sellers_Store_Login );




