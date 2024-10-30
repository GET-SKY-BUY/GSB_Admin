require('dotenv').config();
const express = require('express');
const Sellers_Assistant = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

module.exports = Sellers_Assistant;

Sellers_Assistant.use(bodyParser.json());
Sellers_Assistant.use(bodyParser.urlencoded({ extended: true }));
Sellers_Assistant.use(cookieParser(process.env.COOKIE_SECRET));


const { Sellers_Assistant_Login , Sellers_Assistant_Login_OTP , Seller_Assistant_Home , Seller_Assistant_List , Seller_Assistant_Update , Seller_Assistant_Profile , Seller_Assistant_Search , Seller_Assistant_Shop_Status , Seller_Assistant_Files_View , Seller_Assistant_Logout } = require('../Controllers_Page/Sellers_Assistant.js');
const { SELLER_ASSISTANT_LOGIN , SELLER_ASSISTANT_LOGIN_OTP , SELLER_ASSISTANT_ADD_SELLER , SELLER_ASSISTANT_UPDATE , SELLER_ASSISTANT_CHANGE_PASSWORD , SELLER_ASSISTANT_SEARCH , SELLER_ASSISTANT_SEARCH_SHOP_STATUS } = require('../Controllers/Sellers_Assistant.js');

const Seller_Verify_User_Page = require('../utils/Seller_Verify_User_Page.js');
const Seller_Verify_User_API = require('../utils/Seller_Verify_User_API.js');
const { Multer_Storage_Seller_Profile } = require('../utils/Multer_Storage.js');

Sellers_Assistant.get("/login", Sellers_Assistant_Login );
Sellers_Assistant.post("/login", SELLER_ASSISTANT_LOGIN );
Sellers_Assistant.get("/login/otp", Sellers_Assistant_Login_OTP );
Sellers_Assistant.post("/login-verify-otp", SELLER_ASSISTANT_LOGIN_OTP );
Sellers_Assistant.get("/", Seller_Verify_User_Page , Seller_Assistant_Home  );
Sellers_Assistant.post("/add", Seller_Verify_User_API , Multer_Storage_Seller_Profile , SELLER_ASSISTANT_ADD_SELLER );
Sellers_Assistant.get("/list", Seller_Verify_User_Page , Seller_Assistant_List  );
Sellers_Assistant.get("/update/:ID", Seller_Verify_User_Page , Seller_Assistant_Update  );
Sellers_Assistant.put("/update", Seller_Verify_User_API, SELLER_ASSISTANT_UPDATE  );
Sellers_Assistant.get("/profile", Seller_Verify_User_Page , Seller_Assistant_Profile  );
Sellers_Assistant.put("/change_password", Seller_Verify_User_API , SELLER_ASSISTANT_CHANGE_PASSWORD  );
Sellers_Assistant.get("/search", Seller_Verify_User_Page , Seller_Assistant_Search  );
Sellers_Assistant.post("/search", Seller_Verify_User_API , SELLER_ASSISTANT_SEARCH );
Sellers_Assistant.get("/shop/status", Seller_Verify_User_Page , Seller_Assistant_Shop_Status );
Sellers_Assistant.put("/shop/status", Seller_Verify_User_API , SELLER_ASSISTANT_SEARCH_SHOP_STATUS );
Sellers_Assistant.get("/authorised/seller_documents/:File", Seller_Verify_User_Page , Seller_Assistant_Files_View );
Sellers_Assistant.get("/logout", Seller_Verify_User_Page , Seller_Assistant_Logout );
Sellers_Assistant.get("/issue", (req, res)=>{res.status(404).send("Coming soon")});
Sellers_Assistant.get("/update", async (req, res) => {
    res.status(301).redirect("/sellers_assistant/search");
});
