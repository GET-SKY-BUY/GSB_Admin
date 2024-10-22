require("dotenv").config();
const express = require('express');
const Admin = express.Router();
module.exports = Admin;
const bodyParser = require('body-parser');
Admin.use(bodyParser.json());
Admin.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
Admin.use(cookieParser(process.env.COOKIE_SECRET));


const { Admin_Login }= require('../Controllers/Admin.js');

// Admin Assistant Routes
Admin.post("/login", Admin_Login);
Admin.post("/login-verify-otp", Admin_Login);
Admin.post("/add", Admin_Login);
Admin.post("/search", Admin_Login);
Admin.post("/update", Admin_Login);

// Admin QR-Code Routes
