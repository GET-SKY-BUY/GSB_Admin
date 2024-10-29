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
const { PRODUCTS_ASSISTANT_LOGIN , PRODUCTS_ASSISTANT_LOGIN_OTP , PRODUCTS_ASSISTANT_SEARCH_SELLER , PRODUCTS_ASSISTANT_ADD_PRODUCT } = require("../Controllers/Products_Assistant.js");

const Product_Verify_Page = require("../utils/Product_Verify_Page.js");
const Product_Verify_API = require("../utils/Product_Verify_API.js");

const { Multer_Storage_Product_Images } = require("../utils/Multer_Storage.js");
const Product_Image_Processing = require("../Controllers/Product_Image_Processing.js");

Products_Assistant.get("/login", Products_Assistant_Login_Page );
Products_Assistant.post("/login", PRODUCTS_ASSISTANT_LOGIN );
Products_Assistant.get("/login/otp", Products_Assistant_Login_Page_OTP );
Products_Assistant.post("/login-verify-otp", PRODUCTS_ASSISTANT_LOGIN_OTP );

Products_Assistant.get("/", Product_Verify_Page ,  Product_Assistant_Home );
Products_Assistant.get("/add", Product_Verify_Page , Product_Assistant_Add );
Products_Assistant.post("/search/seller", Product_Verify_API , PRODUCTS_ASSISTANT_SEARCH_SELLER );
Products_Assistant.post("/add", Product_Verify_API , Multer_Storage_Product_Images , Product_Image_Processing , PRODUCTS_ASSISTANT_ADD_PRODUCT );

