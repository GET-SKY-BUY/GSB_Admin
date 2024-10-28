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


const { Products_Assistant_Login_Page , Products_Assistant_Login_Page_OTP , Product_Assistant_Home , Product_Assistant_Add } = require("../Controllers_Page/Products_Assistant.js");
const { PRODUCTS_ASSISTANT_LOGIN , PRODUCTS_ASSISTANT_LOGIN_OTP } = require("../Controllers/Products_Assistant.js");

Products_Assistant.get("/login", Products_Assistant_Login_Page );
Products_Assistant.post("/login", PRODUCTS_ASSISTANT_LOGIN );
Products_Assistant.get("/login/otp", Products_Assistant_Login_Page_OTP );
Products_Assistant.post("/login-verify-otp", PRODUCTS_ASSISTANT_LOGIN_OTP );

Products_Assistant.get("/", Product_Assistant_Home);
Products_Assistant.get("/add", Product_Assistant_Add);

