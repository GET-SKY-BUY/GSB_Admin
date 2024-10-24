require('dotenv').config();
const express = require('express');
const Sellers_Assistant = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

module.exports = Sellers_Assistant;

Sellers_Assistant.use(bodyParser.json());
Sellers_Assistant.use(bodyParser.urlencoded({ extended: true }));
Sellers_Assistant.use(cookieParser(process.env.COOKIE_SECRET));


const { Sellers_Assistant_Login } = require('../Controllers_Page/Sellers_Assistant.js');
const { SELLER_ASSISTANT_LOGIN } = require('../Controllers/Sellers_Assistant.js');


Sellers_Assistant.get("/login", Sellers_Assistant_Login );
Sellers_Assistant.post("/login", SELLER_ASSISTANT_LOGIN );
