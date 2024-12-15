require("dotenv").config();
const Orders_Route = require('express').Router();
module.exports = Orders_Route;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
Orders_Route.use(bodyParser.json());
Orders_Route.use(bodyParser.urlencoded({ extended: true }));
Orders_Route.use(cookieParser(process.env.COOKIE_SECRET));


const { Orders_Login_Page , Orders_Login_Page_OTP } = require("../Controllers_Page/Orders.js");

const { Orders_Login , Order_Login_OTP } = require("../Controllers/Orders.js");
// , Orders_Login_Page_OTP , Orders_Home , Orders_By_Id , Orders_By_Selected , Orders_Profile , Orders_Search 


Orders_Route.get("/login" , Orders_Login_Page );
Orders_Route.get("/login/otp" , Orders_Login_Page_OTP );
Orders_Route.post("/login" , Orders_Login );
Orders_Route.post("/login-verify-otp" , Order_Login_OTP );