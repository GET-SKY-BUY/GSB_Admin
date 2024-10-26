require("dotenv").config();
const express = require("express");
const Sellers_Store = express.Router();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
Sellers_Store.use(bodyParser.json());
Sellers_Store.use(bodyParser.urlencoded({ extended: true }));
Sellers_Store.use(cookieParser(process.env.COOKIE_SECRET));

module.exports = Sellers_Store;

const { Sellers_Store_Login , Sellers_Store_Home } = require("../Controllers_Page/Sellers_Store.js");

const { SELLERS_STORE_LOGIN , SELLERS_STORE_ACTIVE } = require("../Controllers/Sellers_Store.js");

const SELLER_STORE_USER_PAGE = require("../utils/Sellers_Store_User_Page.js");
const SELLER_STORE_USER_API = require("../utils/Sellers_Store_User_API.js");

Sellers_Store.get("/login", Sellers_Store_Login );
Sellers_Store.post("/login", SELLERS_STORE_LOGIN );
Sellers_Store.get("/", SELLER_STORE_USER_PAGE , Sellers_Store_Home );
Sellers_Store.post("/active", SELLER_STORE_USER_API , SELLERS_STORE_ACTIVE );




