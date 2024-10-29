require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { Verify_Token , Generate_Token } = require('../utils/JWT.js');

const { Sellers , Assistants, Categories } = require('../Models.js');

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

const Products_Assistant_Login_Page_OTP = async ( req , res , next ) => {
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
        return res.status(200).render("Products_Assistant_Login_OTP");
    } catch (error) {
        next(error);
    };
};

const Product_Assistant_Home = async ( req , res , next ) => {
    try {
        
        return res.status(200).render("Product_Assistant_Home");
    }catch (error) {
        next(error);
    };
};

const Product_Assistant_Add = async ( req , res , next ) => {
    try {
        let a = await Categories.findById("GSB-Categories");
        if(!a){
            let b = new Categories({
                _id: "GSB-Categories",
                Categories: [],
            });
            await b.save();
            return res.status(404).send("Please try again");
        };
        let AA = "";
        a.Categories.forEach(element => {
            AA += `<option value="${element}">${element}</option>`;
        });
        return res.status(200).render("Product_Assistant_Add",{
            Categories:AA,
        });
    }catch (error) {
        next(error);
    };
};

module.exports = {
    Products_Assistant_Login_Page,
    Products_Assistant_Login_Page_OTP,
    Product_Assistant_Home,
    Product_Assistant_Add,
};
