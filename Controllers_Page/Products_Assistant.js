require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { Verify_Token , Generate_Token } = require('../utils/JWT.js');

const { Sellers, Assistants } = require('../Models.js');

const Products_Assistant_Login_Page = async ( req , res , next ) => {
    try {
        const Token = req.signedCookies.PRODUCT_TOKEN;
        if(Token){
            const User = Verify_Token(Token);
            if(User){
                let Search = await Assistants.findById(User.ID);
                if(Search){
                    if(Search.LoggedIn.Token === User.Token){
                        return res.redirect('/products_assistant');
                    };
                };
            };
        };
        res.clearCookie("PRODUCT_TOKEN",{
            domain: process.env.PROJECT_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: "strict",
        });
        return res.status(200).render("Products_Assistant_Login");
    }catch (error) {
        next(error);
    };
};

module.exports = {
    Products_Assistant_Login_Page,
};
