require('dotenv').config();
const ADMIN_PASS = process.env.ADMIN_PASS;
const { Verify_Token , Generate_Token } = require('../utils/JWT.js');
const { Admin_User , Assistants } = require('../Models.js');

const { Valid_Email, Valid_Password } = require('../utils/Validations.js');
const Send_Mail = require('../utils/Send_Mail.js');
const { Get_Token , Get_OTP } = require('../utils/Auth.js');

async function call(){
    return await Admin_User.findById("GSB_ADMIN_RICK");
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
        res.clearCookie("ADMIN_TOKEN",{
            domain: process.env.PROJECT_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: "strict",
        });
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
        res.clearCookie("ADMIN_TOKEN",{
            domain: process.env.PROJECT_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: "strict",
        });
        return res.status(200).render("Admin_Login_OTP");

    }catch (error) {
        next(error);
    };
};

const ADMIN_HOME = async (req, res, next) => {
    try {
        const Got_User = await call();
        const ADMIN_TOKEN = req.signedCookies.ADMIN_TOKEN;
        const Check = Verify_Token(ADMIN_TOKEN);
        if(Check){
            if(Check.Admin){
                if(Got_User.Token == Check.Token){
                    if(Got_User._id === Check.ID){
                        return res.status(200).render("Admin");
                    };
                };
            };
        };
        return res.status(400).redirect("/admin/login");

    }catch (error) {
        next(error);
    };
};

const ADMIN_ASSISTANT_LIST = async (req, res, next) => {
    try {
        let Data = await Assistants.find({});
        let dc = "";
        for (let W = 0; W < Data.length; W++) {
            const User = Data[W];
            let str = `
            <tr>
                <td><a href="/admin/update/${User._id}">${User._id}</a></td>
                <td>${User.Basic_Details.Name}</td>
                <td>${User.Basic_Details.Mobile}</td>
                <td>${User.Employee_Type}</td>
                <td>${User.Ban}/${User.Verified}</td>
            </tr>
            `;
            dc = str + dc;
        };
        return res.status(200).render("Admin_Assistant_List",{
            Data: dc
        });
        
    }catch (error) {
        next(error);
    };
};

const ADMIN_ASSISTANT_SEARCH = async (req, res, next) => {
    try {
        return res.status(200).render("Admin_Search");
    }catch (error) {
        next(error);
    };
};

const ADMIN_ASSISTANT_UPDATE = async (req, res, next) => {
    try {

        let Data = await Assistants.find({});
        let ID = req.params.ID;
        let iu = 0;
        let bb = 0;
        for (let q = 0; q < Data.length; q++) {
            const User = Data[q];
            if (User._id == ID) {
                iu = 1
                bb = User;
                break;
            }else{
                iu = 0;
            }
        };
        if (iu == 1) {
            let PPPP = {
                id:bb._id,
                Assistant_Type:bb.Employee_Type,
                Acode:bb.Acode,
                Name: bb.Basic_Details.Name,
                Mobile: bb.Basic_Details.Mobile,
                WhatsApp: bb.Basic_Details.WhatsApp,
                Bank_Name: bb.Bank.Bank_Name,
                Benificiary_Name: bb.Bank.Benificiary_Name,
                Account_Number: bb.Bank.Account_Number,
                IFSC: bb.Bank.IFSC,
                UPI: bb.Bank.UPI,
                Gender: bb.Basic_Details.Gender,
                Age: bb.Basic_Details.Age,
                Email:bb.Email,
                Age:bb.Age,
                Gender:bb.Gender,
                Locality: bb.Address.Locality,
                City: bb.Address.City_Town,
                PIN: bb.Address.PIN,
                Dist: bb.Address.Dist,
                State: bb.Address.State,
                Country: bb.Address.Country,
                createdAt: bb.createdAt,
                Ban:bb.Ban,
                Verified:bb.Verified,
            };
            res.status(200).render("Admin_Update", PPPP);
        }else{
            res.status(200).render("Admin_Update", {
                id:"User Not Found",
                Btn:"disabled",
                Assistant_Type:"User Not Found",
            });
        };
    }catch(error){
        next(error);
    };
};

const ADMIN_LOGOUT = async (req, res, next) => {
    try{
        const Got_User = await call();

        Got_User.Token = "";
        Got_User.save().then(() => {
            res.clearCookie("ADMIN_TOKEN",{
                domain: process.env.PROJECT_DOMAIN,
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                signed: true,
                sameSite: "strict",
            });
            return res.status(400).redirect("/admin/login");
        });
    }catch (error) {
        next(error);
    };
};

module.exports = {
    GET_LOGIN_PAGE,
    GET_LOGIN_OTP_PAGE,
    ADMIN_HOME,
    ADMIN_ASSISTANT_LIST,
    ADMIN_ASSISTANT_SEARCH,
    ADMIN_ASSISTANT_UPDATE,
    ADMIN_LOGOUT,
};