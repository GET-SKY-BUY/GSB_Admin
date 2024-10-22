require("dotenv").config();
const express = require('express');
const Admin = express.Router();
module.exports = Admin;
const bodyParser = require('body-parser');
Admin.use(bodyParser.json());
Admin.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
Admin.use(cookieParser(process.env.COOKIE_SECRET));


const { Admin_Login , Admin_OTP , Admin_Assistant_Add }= require('../Controllers/Admin.js');
const { GET_LOGIN_PAGE , GET_LOGIN_OTP_PAGE , ADMIN_HOME ,ADMIN_ASSISTANT_LIST }= require('../Controllers_Page/Admin.js');
const Verify_User_Page  = require('../utils/Verify_User_Page.js');
const Verify_User_API  = require('../utils/Verify_User_API.js');


// Admin Authentication Routes
Admin.get("/login", GET_LOGIN_PAGE);
Admin.post("/login", Admin_Login);
Admin.get("/login/otp", GET_LOGIN_OTP_PAGE);
Admin.post("/login-verify-otp", Admin_OTP);

// Admin Assistant Routes
Admin.get("/", Verify_User_Page ,ADMIN_HOME);
Admin.post("/assistant/add", Verify_User_API , Admin_Assistant_Add);
Admin.get("/list", Verify_User_Page , ADMIN_ASSISTANT_LIST);
Admin.post("/search", Admin_Login);
Admin.post("/update", Admin_Login);

// Admin QR-Code Routes
