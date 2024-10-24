require('dotenv').config();
const express = require('express');
const Sellers_Assistant = express.Router();
const { Verify_Token , Generate_Token } = require('../utils/JWT.js');
const { Admin_User , Assistants } = require('../Models.js');
const { Valid_Email, Valid_Password } = require('../utils/Validations.js');
const Send_Mail = require('../utils/Send_Mail.js');
const { Get_Token , Get_OTP } = require('../utils/Auth.js');
const Verify_User_Page = require('../utils/Verify_User_Page');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

module.exports = Sellers_Assistant;

Sellers_Assistant.use(bodyParser.json());
Sellers_Assistant.use(bodyParser.urlencoded({ extended: true }));
Sellers_Assistant.use(cookieParser(process.env.COOKIE_SECRET));


const { Sellers_Assistant_Login } = require('../Controllers_Page/Sellers_Assistant.js');


Sellers_Assistant.get("/login", Sellers_Assistant_Login );
