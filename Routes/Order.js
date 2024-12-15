require("dotenv").config();
const Orders_Route = require('express').Router();
module.exports = Orders_Route;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
Orders_Route.use(bodyParser.json());
Orders_Route.use(bodyParser.urlencoded({ extended: true }));

Orders_Route.use(cookieParser(process.env.COOKIE_SECRET));

const { Orders_Login_Page } = require("../Controllers_Page/Orders.js");

// , Orders_Login_Page_OTP , Orders_Home , Orders_By_Id , Orders_By_Selected , Orders_Profile , Orders_Search 


Orders_Route.get("/login" ,  );