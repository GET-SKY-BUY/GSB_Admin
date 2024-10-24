require("dotenv").config();
const { Verify_Token } = require("./JWT.js");
const { Sellers , Assistants } = require("../Models.js");

const Verify_User_Page = async ( req, res, next) => {
    try {
        const ADMIN_TOKEN = req.signedCookies.SELLER_TOKEN;
        const Check = Verify_Token(ADMIN_TOKEN);
        let Found = false;
        let Search;
        if(Check){
            Search = await Assistants.findById(Check.ID);
            if(Search){
                if(Search.LoggedIn.Token === Check.Token){
                    Found = true;
                };
            };
        };
        if(!Found){
            res.clearCookie("SELLER_TOKEN",{
                domain: process.env.PROJECT_DOMAIN,
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                signed: true,
                sameSite: "strict",
            });
            return res.status(400).redirect("/sellers_assistant/login");
        };
        req.User = Search;
        next();
    } catch (err) {
        next(err);
    };
};
module.exports = Verify_User_Page;