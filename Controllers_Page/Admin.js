require('dotenv').config();
const ADMIN_PASS = process.env.ADMIN_PASS;
const { Verify_Token , Generate_Token } = require('../utils/JWT.js');
const { Admin_User } = require('../Models.js');

const { Valid_Email, Valid_Password } = require('../utils/Validations.js');
const Send_Mail = require('../utils/Send_Mail.js');
const { Get_Token , Get_OTP } = require('../utils/Auth.js');

async function call(){
    return await Admin_User.findById("GSB_ADMIN_RICK");
}


const Cookie_Options_OTP = {
    domain: process.env.PROJECT_DOMAIN,
    path: "/",
    httpOnly: true,
    maxAge: 1000 * 60 * 5,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    sameSite: "strict",
};
const Cookie_Options_Final = {
    domain: process.env.PROJECT_DOMAIN,
    path: "/",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    sameSite: "strict",
};



const GET_LOGIN_PAGE = async (req, res, next) => {
    try{
        const Got_User = await call();
        const ADMIN_TOKEN = req.signedCookies.ADMIN_TOKEN;
        const Check = Verify_Token(ADMIN_TOKEN);
        if(Check){
            if(Check.Admin){
                if(Got_User.Token == Check.Token){
                    if(Got_User._id === Check.ID){
                        return res.status(400).redirect("/admin");
                    };
                };
            };
        };
        return res.status(200).render("Admin_Login");

    }catch (error) {
        next(error);
    }
};

const GET_LOGIN_OTP_PAGE = async (req, res, next) => {
    try{
        const Got_User = await call();
        const ADMIN_TOKEN = req.signedCookies.ADMIN_TOKEN;
        const Check = Verify_Token(ADMIN_TOKEN);
        if(Check){
            if(Check.Admin){
                if(Got_User.Token == Check.Token){
                    if(Got_User._id === Check.ID){
                        return res.status(400).redirect("/admin");
                    };
                };
            };
        };
        return res.status(200).render("Admin_Login_OTP");

    }catch (error) {
        next(error);
    }
};

module.exports = {
    GET_LOGIN_PAGE,
    GET_LOGIN_OTP_PAGE
};