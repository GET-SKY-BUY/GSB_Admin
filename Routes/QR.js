require("dotenv").config();
const express = require("express");
const QR = express.Router();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
QR.use(bodyParser.json());
QR.use(bodyParser.urlencoded({ extended: true }));
QR.use(cookieParser(process.env.COOKIE_SECRET));
module.exports = QR;

const { QR_ID , QR_Update } = require("../Controllers_Page/QR.js");
QR.get("/:ID", QR_ID );
QR.put("/update", QR_Update );