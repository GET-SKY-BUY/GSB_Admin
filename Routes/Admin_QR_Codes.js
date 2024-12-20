require("dotenv").config();
const express = require('express');
const QR_Codes = express.Router();
module.exports = QR_Codes;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
QR_Codes.use(bodyParser.json());
QR_Codes.use(bodyParser.urlencoded({ extended: true }));
QR_Codes.use(cookieParser(process.env.COOKIE_SECRET));

const Verify_User_Page  = require('../utils/Verify_User_Page.js');
const Verify_User_API  = require('../utils/Verify_User_API.js');

const { QR_HOMEPAGE , QR_code_Generate , QR_deleted , QR_final , QR_Search , QR_Delete_QR , QR_PAGE } = require('../Controllers_Page/Admin_QR.js');

QR_Codes.get("/", Verify_User_Page , QR_HOMEPAGE );
QR_Codes.post("/generate_codes", Verify_User_API , QR_code_Generate );
QR_Codes.delete("/temp", Verify_User_API , QR_deleted );
QR_Codes.put("/final", Verify_User_API , QR_final );
QR_Codes.post("/search", Verify_User_API , QR_Search );
QR_Codes.delete("/qr-delete", Verify_User_API , QR_Delete_QR );
QR_Codes.get("/qr-page", Verify_User_Page , QR_PAGE );