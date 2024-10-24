require('dotenv').config();

const { Verify_Token , Generate_Token } = require('../utils/JWT.js');

const { Valid_Email, Valid_Password } = require('../utils/Validations.js');
const { Sellers , Assistants } = require('../Models.js');
const { Password_Compare } = require('../utils/Password.js');

const Send_Mail  = require('../utils/Send_Mail.js');
const { Get_Token , Get_OTP } = require('../utils/Auth.js');





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



const SELLER_ASSISTANT_LOGIN = async (req, res, next) => {
    try {
        
        const Token = req.signedCookies.SELLER_TOKEN;
        if(Token){
            const User = Verify_Token(Token);
            if(User){
                let Search = await Sellers.findById(User.ID);
                if(Search){
                    if(Search.LoggedIn.Token === User.Token){
                        return res.status(400).json({
                            Status: "Success",
                            Message: "Already Logged In",
                        });
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
        req.body.Email = req.body.Email.toLowerCase();

        if(!(Valid_Email(req.body.Email) && Valid_Password(req.body.Password))){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid Email or Password",
            });
        };

        let Search = await Assistants.findOne({ Email: req.body.Email , Employee_Type: "Seller Assistant" });
        if(!Search){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid Email or Password",
            });
        };
        if(!await Password_Compare(req.body.Password, Search.Password)){
            return res.status(401).json({
                Status: "Failed",
                Message: "Incorrect Password",
            });
        };
        
        const New_Gen_Token = await Get_Token();
        const OTP = await Get_OTP();

        Search.Auth.Token = New_Gen_Token;
        Search.Auth.OTP_Expiry = Date.now() + 1000 * 60 * 5;
        Search.Auth.OTP = OTP;
        
        let NewToken = Generate_Token({
            ID: Search._id,
            Token: New_Gen_Token,
            OTP: true,
        });

        let Status = await Send_Mail({
            from: "Seller assistant - OTP" + "<" + process.env.MAIL_ID + ">",
            to: req.body.Email,
            subject: "OTP Verification - Seller assistant",
            html: `Hello ${Search.Basic_Details.Name}, <br>Your OTP is ${OTP}. <br><br>It is valid for 5 minutes.`,
        });

        if(!Status){
            return res.status(400).json({
                Status: "Failed",
                Message: "Unable to sent OTP",
            });
        };

        await Search.save().then(() => {
            res.cookie("SELLER_OTP", NewToken, Cookie_Options_OTP);
            return res.status(200).json({
                Status: "Success",
                Message: "OTP Sent successfully",
            });
        });

    } catch ( e ) {
        next(e);
    };
};

const SELLER_ASSISTANT_LOGIN_OTP = async ( req , res , next ) => {
    try {
        const Token = req.signedCookies.SELLER_TOKEN;
        if(Token){
            const User = Verify_Token(Token);
            if(User){
                let Search = await Sellers.findById(User.ID);
                if(Search){
                    if(Search.LoggedIn.Token === User.Token){
                        return res.status(400).json({
                            Status: "Success",
                            Message: "Already Logged In",
                        });
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

        const VerifyOTP_TOKEN = req.signedCookies.SELLER_OTP;
        if(!VerifyOTP_TOKEN){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized Access",
            });
        };
        const TokenVerify = Verify_Token(VerifyOTP_TOKEN);
        if(!TokenVerify){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized Access",
            });
        };
        
        if(!TokenVerify.OTP){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized Access",
            });
        };

        const Recieved_OTP = req.body.OTP;

        if(!Recieved_OTP){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid OTP",
            });
        };
        if(Recieved_OTP.length !== 6){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid OTP",
            });
        }

        let Search = await Assistants.findById(TokenVerify.ID);
        if(!Search){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized Access",
            });
        };
        if(Search.Auth.OTP !== Recieved_OTP){
            return res.status(400).json({
                Status: "Failed",
                Message: "Invalid OTP",
            });
        };
        if(Search.Auth.Token !== TokenVerify.Token){
            return res.status(401).json({
                Status: "Failed",
                Message: "Unauthorized Access",
            });
        };

        if(Search.Auth.OTP_Expiry < new Date()){
            return res.status(400).json({
                Status: "Failed",
                Message: "OTP Expired",
            });
        }


        
        const New_Gen_Token = await Get_Token();

        
        let NewToken = Generate_Token({
            ID: Search._id,
            Token: New_Gen_Token,
        });

        let Status = await Send_Mail({
            from: "Seller Assistant - Login" + "<" + process.env.MAIL_ID + ">",
            to: Search.Email,
            subject: "Seller Assistant - Logged in",
            html: `Hello ${Search.Basic_Details.Name}, <br>You have just logged in, if not done by you please change your password.`,
        });

        if(!Status){
            return res.status(400).json({
                Status: "Failed",
                Message: "Unable to send Email",
            });
        };
        
        Search.Auth.OTP = "";
        Search.Auth.OTP_Expiry = new Date();
        Search.Auth.Token = "";
        Search.LoggedIn = {
            Token:`${New_Gen_Token}`,
            Created: new Date(),
        };
            


        await Search.save().then(c => {
            res.cookie("SELLER_TOKEN", NewToken, Cookie_Options_Final);
            res.clearCookie("SELLER_OTP",{
                domain: process.env.PROJECT_DOMAIN,
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                signed: true,
                sameSite: "strict",
            });
            return res.status(200).json({
                Status: "Success",
                Message: "Logged in successful",
            });
        });

    } catch (error) {
        next(error);
    };
};

module.exports = {
    SELLER_ASSISTANT_LOGIN,
    SELLER_ASSISTANT_LOGIN_OTP,
};