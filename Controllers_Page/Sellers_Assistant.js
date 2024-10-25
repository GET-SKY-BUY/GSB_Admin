require('dotenv').config();

const { Verify_Token , Generate_Token } = require('../utils/JWT.js');

const { Sellers, Assistants } = require('../Models.js');

const Sellers_Assistant_Login = async (req, res, next) => {
    try {
        const Token = req.signedCookies.SELLER_TOKEN;
        if(Token){
            const User = Verify_Token(Token);
            if(User){
                let Search = await Assistants.findById(User.ID);
                if(Search){
                    if(Search.LoggedIn.Token === User.Token){
                        return res.redirect('/sellers_assistant');
                    };
                };
            };
        };
        res.clearCookie("SELLER_TOKEN",{
            domain: process.env.PROJECT_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: "strict",
        });
        return res.status(200).render("Sellers_Assistant_Login");
    } catch (error) {
        next(error);
    };
};

const Sellers_Assistant_Login_OTP = async ( req , res , next ) => {
    try {
        const Token = req.signedCookies.SELLER_TOKEN;
        if(Token){
            const User = Verify_Token(Token);
            if(User){
                let Search = await Assistants.findById(User.ID);
                if(Search){
                    if(Search.LoggedIn.Token === User.Token){
                        console.log(111);
                        return res.redirect('/sellers_assistant');
                    };
                };
            };
        };

        res.clearCookie("SELLER_TOKEN",{
            domain: process.env.PROJECT_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: "strict",
        });
        return res.status(200).render("Sellers_Assistant_Login_OTP");
    }catch(error){
        next(error);
    };
};

const Seller_Assistant_Home = async ( req , res , next ) => {
    try {
        const Got_User = req.User;

        return res.status(200).render("Sellers_Assistant_Home");
    } catch (error) {
        next(error);
    };
};


const Seller_Assistant_List = async ( req , res , next ) => {
    try {
        const Got_User = req.User;

        let Data = await Sellers.find();
        let POP = "";
        Data.forEach(element => {
            POP = `
                <tr>
                    <td><a href="/seller/update/${element._id}">${element._id}</a></td>
                    <td>${element.Basic_Details.Mobile_Number}</td>
                    <td>${element.Store.Shop_Name}</td>
                </tr>
            `+ POP;
        });
        res.status(200).render("Sellers_Assistant_List",{Sellers:POP});
    } catch (error) {
        next(error);
    };
}


module.exports = {
    Sellers_Assistant_Login,
    Sellers_Assistant_Login_OTP,
    Seller_Assistant_Home,
    Seller_Assistant_List,
};