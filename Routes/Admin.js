require("dotenv").config();
const express = require('express');
const Admin = express.Router();
module.exports = Admin;
const bodyParser = require('body-parser');
Admin.use(bodyParser.json());
Admin.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
Admin.use(cookieParser(process.env.COOKIE_SECRET));


const { Admin_Login , Admin_OTP , Admin_Assistant_Add , Admin_Search_Assistant , Admin_Assistant_Update }= require('../Controllers/Admin.js');
const { GET_LOGIN_PAGE , GET_LOGIN_OTP_PAGE , ADMIN_HOME ,ADMIN_ASSISTANT_LIST , ADMIN_ASSISTANT_SEARCH , ADMIN_ASSISTANT_UPDATE , ADMIN_LOGOUT }= require('../Controllers_Page/Admin.js');
const Verify_User_Page  = require('../utils/Verify_User_Page.js');
const Verify_User_API  = require('../utils/Verify_User_API.js');

Admin.use("/qr_codes", require('./Admin_QR_Codes.js'));

// Admin Authentication Routes
Admin.get("/login", GET_LOGIN_PAGE);
Admin.get("/login/otp", GET_LOGIN_OTP_PAGE);

Admin.post("/login", Admin_Login);
Admin.post("/login-verify-otp", Admin_OTP);

// Admin Assistant Routes
Admin.get("/", Verify_User_Page , ADMIN_HOME);
Admin.get("/list", Verify_User_Page , ADMIN_ASSISTANT_LIST);
Admin.get("/search", Verify_User_Page , ADMIN_ASSISTANT_SEARCH);
Admin.get("/update/:ID", Verify_User_Page , ADMIN_ASSISTANT_UPDATE);
Admin.get("/update/", Verify_User_Page , ( req , res , next) =>{
    res.redirect("/admin/search");
});
Admin.get("/logout/", Verify_User_Page , ADMIN_LOGOUT );

Admin.post("/assistant/add", Verify_User_API , Admin_Assistant_Add );
Admin.post("/assistant/search", Verify_User_API , Admin_Search_Assistant );
Admin.put("/assistant/update", Verify_User_API  , Admin_Assistant_Update );