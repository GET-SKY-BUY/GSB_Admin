const Contact_Us = require('express').Router();

module.exports = Contact_Us;


const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
Contact_Us.use(bodyParser.json());
Contact_Us.use(bodyParser.urlencoded({ extended: true }));
Contact_Us.use(cookieParser(process.env.COOKIE_SECRET));

const { Contact_Us_Login_Page , Contact_Us_Login_Page_OTP , Contact_Us_Home } = require("../Controllers_Page/Contact_Us.js");

const { Contact_Us_LOGIN , Contact_Us_LOGIN_OTP } = require("../Controllers/Contact_Us.js");

const Contact_Us_API = require("../utils/Contact_Us_API.js");
const Contact_Us_Page = require("../utils/Contact_Us_Page.js");

Contact_Us.get("/login", Contact_Us_Login_Page );
Contact_Us.post("/login", Contact_Us_LOGIN );
Contact_Us.get("/login/otp", Contact_Us_Login_Page_OTP );
Contact_Us.post("/login-verify-otp", Contact_Us_LOGIN_OTP );
Contact_Us.get("/", Contact_Us_Page ,  );