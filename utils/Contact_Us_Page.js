require("dotenv").config();
const { Verify_Token } = require("./JWT.js");
const { Sellers , Assistants } = require("../Models.js");

const Contact_Us_Verify_Page = async ( req, res, next) => {
    try {
        const ADMIN_TOKEN = req.signedCookies.CONTACT_US_TOKEN;
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
            res.clearCookie("CONTACT_US_TOKEN",{
                domain: process.env.PROJECT_DOMAIN,
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                signed: true,
                sameSite: "strict",
            });
            return res.status(400).redirect("/contact_us/login");
        };
        req.User = Search;
        next();
    } catch (err) {
        next(err);
    };
};

module.exports = Contact_Us_Verify_Page;