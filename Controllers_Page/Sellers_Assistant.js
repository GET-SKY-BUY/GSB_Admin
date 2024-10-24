require('dotenv').config();

const { Verify_Token , Generate_Token } = require('../utils/JWT.js');

const { Sellers } = require('../Models.js');

const Sellers_Assistant_Login = async (req, res, next) => {
    try {
        const Token = req.signedCookies.SELLER_TOKEN;
        if(Token){
            const User = Verify_Token(Token);
            if(User){
                let Search = await Sellers.findById(User.ID);
                if(Search){
                    if(Search.LoggedIn.Token === User.Token){
                        return res.redirect('/');
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

module.exports = {
    Sellers_Assistant_Login,
};