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

const Admin_Login = async (req, res, next) => {

    try {
        const Got_User = await call();
        const ADMIN_TOKEN = req.signedCookies.ADMIN_TOKEN;
        const Check = Verify_Token(ADMIN_TOKEN);
        if(Check){
            if(Check.Admin){
                if(Got_User.Token == Check.Token){
                    if(Got_User._id === Check.ID){
                        return res.status(400).json({
                            Status: "Failed",
                            Message: "Already Logged In."
                        });
                    };
                };
            };
        };

        const { Email, Password } = req.body;
        if(!Valid_Email(Email)){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid Email."
            });
        };
        if(!Valid_Password(Password)){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid Password."
            });
        };
        if(Password !== ADMIN_PASS){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid Password."
            });
        };

        
        
        const Token = await Get_Token();
        const OTP = await Get_OTP();
        let Status = await Send_Mail({
            from: "Admin - OTP" + "<" + process.env.MAIL_ID + ">",
            to: Got_User.Email,
            subject: "OTP Verification - Admin",
            html: `Hello Rick, <br>Your OTP is ${OTP}. <br><br>It is valid for 5 minutes.`,
        });
        if(!Status){
            return res.status(500).json({
                Status: "Failed",
                Message: "Internal Server Error."
            });
        };

        const JWT_TOKEN = Generate_Token({
            ID: "GSB_ADMIN_RICK",
            Admin: false,
            Token: Token,
        });
        
        Got_User.Auth = {
            Token : Token,
            OTP_Expiry : Date.now() + 1000 * 60 * 5,
            OTP : OTP,
        }
        // console.log(Got_User);
        await Got_User.save().then(() => {
            res.cookie("OTP_TOKEN",JWT_TOKEN,Cookie_Options_OTP);
            return res.status(200).json({
                Status: "Success",
                Message: "OTP Sent.",
            });
        });
    } catch (error) {
        next(error);
    };
};

const Admin_OTP = async (req, res, next) => {
    try {
        const Got_User = await call();
        const ADMIN_TOKEN = req.signedCookies.ADMIN_TOKEN;
        const Check = Verify_Token(ADMIN_TOKEN);
        if(Check){
            if(Check.Admin){
                if(Got_User.Token == Check.Token){
                    if(Got_User._id === Check.ID){
                        return res.status(400).json({
                            Status: "Failed",
                            Message: "Already Logged In."
                        });
                    };
                };
            };
        };


        const { OTP } = req.body;
        if(!OTP){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid OTP."
            });
        };
        if(OTP.length !== 6){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid OTP."
            });
        };


        const OTP_TOKEN = req.signedCookies.OTP_TOKEN;
        const Check_OTP = Verify_Token(OTP_TOKEN);
        if(!Check_OTP){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unathorized access."
            });
        };
        if(Check_OTP.Admin){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unathorized access."
            });
        };
        if(Got_User.Auth.Token !== Check_OTP.Token){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unathorized access."
            });
        };
        if(Got_User._id !== Check_OTP.ID){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unathorized access."
            });
        };
        if(Got_User.Auth.OTP !== OTP){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid OTP."
            });
        };
        if(Got_User.Auth.OTP_Expiry < Date.now()){
            return res.status(400).json({
                Status: "Failed",
                Message: "OTP Expired."
            });
        };
        if(Got_User.Auth.Token != Check_OTP.Token){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid Token."
            });
        };

        
        const Token = await Get_Token();




        let Status = await Send_Mail({
            from: "Admin - Login" + "<" + process.env.MAIL_ID + ">",
            to: Got_User.Email,
            subject: "Admin - Logged in",
            html: `Hello Rick, <br>You have just logged in, if not done by you please change your password.`,
        });
        if(!Status){
            return res.status(500).json({
                Status: "Failed",
                Message: "Internal Server Error."
            });
        };
        const JWT_TOKEN = Generate_Token({
            ID: "GSB_ADMIN_RICK",
            Admin: true,
            Token: Token,
        });

        Got_User.Token = Token;
        Got_User.Auth.Token = "";
        Got_User.Auth.OTP_Expiry = 0;
        Got_User.Auth.OTP = "";
        
        await Got_User.save().then(() => {
            res.clearCookie("OTP_TOKEN",{
                domain: process.env.PROJECT_DOMAIN,
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                signed: true,
                sameSite: "strict",
            });
            res.cookie("ADMIN_TOKEN",JWT_TOKEN,Cookie_Options_Final);
            return res.status(200).json({
                Status: "Success",
                Message: "Logged In.",
            });
        });

    } catch (error) {
        next(error);
    };
};

module.exports = {
    Admin_Login,
    Admin_OTP,
};