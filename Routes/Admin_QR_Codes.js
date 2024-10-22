require("dotenv").config();
const express = require('express');
const QR_Codes = express.Router();
module.exports = QR_Codes;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
QR_Codes.use(bodyParser.json());
QR_Codes.use(bodyParser.urlencoded({ extended: true }));
QR_Codes.use(cookieParser(process.env.COOKIE_SECRET));


QR_Codes.get("/", );