require("dotenv").config();
const Delivery_Route = require('express').Router();
module.exports = Delivery_Route;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
Delivery_Route.use(bodyParser.json());
Delivery_Route.use(bodyParser.urlencoded({ extended: true }));
Delivery_Route.use(cookieParser(process.env.COOKIE_SECRET));


const { Delivery_Login_Page , Delivery_Login_Page_OTP } = require("../Controllers_Page/Delivery.js");

const { Delivery_Login , Delivery_Login_OTP } = require("../Controllers/Delivery.js");
//  Orders_Home , Orders_By_Id , Orders_By_Selected , Orders_Profile , Orders_Search 


Delivery_Route.get("/login" , Delivery_Login_Page );
Delivery_Route.get("/login/otp" , Delivery_Login_Page_OTP );
Delivery_Route.post("/login" , Delivery_Login );
Delivery_Route.post("/login-verify-otp" , Delivery_Login_OTP );