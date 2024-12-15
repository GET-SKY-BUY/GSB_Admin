require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { Verify_Token , Generate_Token } = require('../utils/JWT.js');

const { Valid_Email, Valid_Password , Valid_Mobile } = require('../utils/Validations.js');

const { Sellers , Assistants, Categories , Products } = require('../Models.js');

const Delivery_Login_Page = async ( req , res , next ) => {
    try {
        const Token = req.signedCookies.DELIVERY_TOKEN;
        if(Token){
            const User = Verify_Token(Token);
            if(User){
                let Search = await Assistants.findById(User.ID);
                if(Search){
                    if(Search.LoggedIn.Token === User.Token){
                        return res.redirect('/delivery');
                    };
                };
            };
        };
        res.clearCookie("DELIVERY_TOKEN",{
            domain: process.env.PROJECT_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: "strict",
        });
        return res.status(200).render("Delivery_Login");
    } catch ( error ) {
        next( error );
    };
};

const Delivery_Login_Page_OTP = async ( req , res , next ) => {
    try {

        const Token = req.signedCookies.DELIVERY_TOKEN;
        if(Token){
            const User = Verify_Token(Token);
            if(User){
                let Search = await Assistants.findById(User.ID);
                if(Search){
                    if(Search.LoggedIn.Token === User.Token){
                        return res.redirect('/delivery');
                    };
                };
            };
        };

        res.clearCookie("DELIVERY_TOKEN",{
            domain: process.env.PROJECT_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: "strict",
        });
        return res.status(200).render("Delivery_Login_OTP");

    } catch ( error ) {
        next( error );
    };
};
module.exports = {
    Delivery_Login_Page,
    Delivery_Login_Page_OTP,
};