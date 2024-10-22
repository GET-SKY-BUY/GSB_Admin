require("dotenv").config();
const express = require('express');
const Admin = express.Router();
module.exports = Admin;
const bodyParser = require('body-parser');
Admin.use(bodyParser.json());
Admin.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
Admin.use(cookieParser(process.env.COOKIE_SECRET));


const { Admin_Login , Admin_OTP }= require('../Controllers/Admin.js');
const { GET_LOGIN_PAGE }= require('../Controllers_Page/Admin.js');

// Admin Authentication Routes
Admin.get("/login", GET_LOGIN_PAGE);
Admin.post("/login", Admin_Login);
Admin.post("/login-verify-otp", Admin_OTP);

// Admin Assistant Routes
Admin.post("/add", Admin_Login);
Admin.post("/search", Admin_Login);
Admin.post("/update", Admin_Login);

// Admin QR-Code Routes
