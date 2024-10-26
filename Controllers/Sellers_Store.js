require('dotenv').config();
const fs = require('fs');
const path = require('path');

const { Verify_Token , Generate_Token } = require('../utils/JWT.js');

const { Valid_Email, Valid_Password , Valid_Mobile } = require('../utils/Validations.js');
const { Sellers , Assistants } = require('../Models.js');
const { Password_Compare , Password_Hash } = require('../utils/Password.js');

const Send_Mail  = require('../utils/Send_Mail.js');
const { Get_Token , Get_OTP } = require('../utils/Auth.js');

const Profile_ID = require('../utils/Profile_ID.js');

const Cookie_Options_Final = {
    domain: process.env.PROJECT_DOMAIN,
    path: "/",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    sameSite: "strict",
};



const SELLERS_STORE_LOGIN = async ( req , res , next ) => {
    try {

        const Recieved_Token = req.signedCookies.SELLER_STORE;
        if (Recieved_Token) {
            const Verify = Verify_Token(Recieved_Token);
            if (Verify) {
                if(Verify.ID){
                    let data = await Sellers.findById(Verify.ID);
                    if(data){
                        if(data.LoggedIn.Token === Verify.Token){
                            return res.status(400).json({Status: "Failed" , Message: "Already Logged In"});
                        };
                    };
                };
            };
        };

        let { Email , Password } = req.body;
        if(!Email || !Password){
            return res.status(400).json({Status: "Failed" , Message: "Invalid Email or Password"});
        };
        if(!Valid_Email(Email)){
            return res.status(400).json({Status: "Failed" , Message: "Invalid Email"});
        };
        Email = Email.toLowerCase().trim();
        if(!Valid_Password(Password)){
            return res.status(400).json({Status: "Failed" , Message: "Invalid Password"});
        };

        let data = await Sellers.findOne({Email: Email});
        if(!data){
            return res.status(400).json({Status: "Failed" , Message: "You don't have an account."});
        };

        let Password_Check = await Password_Compare(Password , data.Password);
        if(!Password_Check){
            return res.status(400).json({Status: "Failed" , Message: "Incorrect Password"});
        };

        let GetTok = await Get_Token();
        data.LoggedIn.Token = GetTok;
        data.LoggedIn.Created = new Date();

        let sta = await Send_Mail({
            from: `Login alert - Sellers Store <${process.env.MAIL_ID}>`,
            to: Email,
            subject: "Login Alert - Sellers Store",
            text: `You have logged in to your account (${data._id}) at ${new Date().toDateString() + " " + new Date().toLocaleTimeString()}`,
        });
        if(!sta){
            return res.status(400).json({Status: "Failed" , Message: "Failed to send mail"});
        };
        await data.save().then( async () => {
            res.cookie('SELLER_STORE' , Generate_Token({
                ID: data._id,
                Token: GetTok,
            }), Cookie_Options_Final );
            return res.status(200).json({Status: "Success" , Message: "Logged In"});
        });


    } catch (error) {
        next(error);
    };
};


const SELLERS_STORE_ACTIVE = async ( req , res , next ) => {
    try {
        const Got_User = req.User;
        const { Active } = req.body;
        if(Active == "Yes"){
            Got_User.DayActive = "No";
        }else if (Active == "No"){
            Got_User.DayActive = "Yes";
        }else{
            return res.status(400).json({Status: "Failed" , Message: "Invalid Active Status"});
        };
        await Got_User.save().then( async () => {
            return res.status(200).json({Status: "Success" , Message: "Updated active status."});
        });
        
    } catch (error) {
        next(error);
    };
};

module.exports = {
    SELLERS_STORE_LOGIN,
    SELLERS_STORE_ACTIVE,
};