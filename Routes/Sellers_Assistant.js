require('dotenv').config();
const express = require('express');
const Sellers_Assistant = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

module.exports = Sellers_Assistant;

Sellers_Assistant.use(bodyParser.json());
Sellers_Assistant.use(bodyParser.urlencoded({ extended: true }));
Sellers_Assistant.use(cookieParser(process.env.COOKIE_SECRET));


const { Sellers_Assistant_Login , Sellers_Assistant_Login_OTP , Seller_Assistant_Home , Seller_Assistant_List } = require('../Controllers_Page/Sellers_Assistant.js');
const { SELLER_ASSISTANT_LOGIN , SELLER_ASSISTANT_LOGIN_OTP , SELLER_ASSISTANT_ADD_SELLER } = require('../Controllers/Sellers_Assistant.js');

const Seller_Verify_User_Page = require('../utils/Seller_Verify_User_Page.js');
const Seller_Verify_User_API = require('../utils/Seller_Verify_User_API.js');
const { Multer_Storage_Seller_Profile } = require('../utils/Multer_Storage.js');

Sellers_Assistant.get("/login", Sellers_Assistant_Login );
Sellers_Assistant.post("/login", SELLER_ASSISTANT_LOGIN );
Sellers_Assistant.get("/login/otp", Sellers_Assistant_Login_OTP );
Sellers_Assistant.post("/login-verify-otp", SELLER_ASSISTANT_LOGIN_OTP );
Sellers_Assistant.get("/", Seller_Verify_User_Page , Seller_Assistant_Home  );
Sellers_Assistant.post("/add", Seller_Verify_User_Page , Multer_Storage_Seller_Profile , SELLER_ASSISTANT_ADD_SELLER );
Sellers_Assistant.get("/list", Seller_Verify_User_Page , Seller_Assistant_List  );
