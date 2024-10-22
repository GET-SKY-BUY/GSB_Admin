require("dotenv").config();
const { Verify_Token } = require("./JWT.js");
const { User } = require("../Models.js");


const { Admin_User } = require('../Models.js');

async function call(){
    return await Admin_User.findById("GSB_ADMIN_RICK");
}
const Verify_User_API = async ( req, res, next) => {
    try {
        const Got_User = await call();
        const ADMIN_TOKEN = req.signedCookies.ADMIN_TOKEN;
        const Check = Verify_Token(ADMIN_TOKEN);
        let Found = false;
        if(Check){
            if(Check.Admin){
                if(Got_User.Token == Check.Token){
                    if(Got_User._id === Check.ID){
                        Found = true;
                    };
                };
            };
        };
        
        if(!Found){
            res.clearCookie("ADMIN_TOKEN",{
                domain: process.env.PROJECT_DOMAIN,
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                signed: true,
                sameSite: "strict",
            });
            return res.status(400).json({
                Status: "Failed",
                Message: "Unauthorized access."
            });
        };
        next();
    } catch (err) {
        next(err);
    };
};
module.exports = Verify_User_API;