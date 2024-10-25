require('dotenv').config();
const path = require('path');
const fs = require('fs');
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
                    <td><a href="/sellers_assistant/update/${element._id}">${element._id}</a></td>
                    <td>${element.Basic_Details.Mobile_Number}</td>
                    <td>${element.Store.Shop_Name}</td>
                </tr>
            `+ POP;
        });
        res.status(200).render("Sellers_Assistant_List",{Sellers:POP});
    } catch (error) {
        next(error);
    };
};

const Seller_Assistant_Update = async ( req , res , next ) => {
    try {
        const Got_User = req.User;
        let SearchID = req.params.ID;
        let Data = await Sellers.findById(SearchID).populate("Assistant_ID").exec();
        // console.log(Data);
        if (Data !== null) {
            let send = {
                ID: Data._id,
                Email: Data.Email,
                First_Name: Data.Basic_Details.First_Name,
                Last_Name: Data.Basic_Details.Last_Name,
                Mobile_Number: Data.Basic_Details.Mobile_Number,
                Alt_Number: Data.Basic_Details.Alt_Number,
                Age: Data.Basic_Details.Age,
                Gender: `<option value="${Data.Basic_Details.Gender}">${Data.Basic_Details.Gender}</option>`,
                
                Landmark:Data.Address.Landmark,
                Locality:Data.Address.Locality,
                Town_City:Data.Address.Town_City,
                PIN_Code:Data.Address.PIN_Code,
                State:`<option value="${Data.Address.State}">${Data.Address.State}</option>`,
                District:`<option value="${Data.Address.District}">${Data.Address.District}</option>`,                    
                Country:`<option value="${Data.Address.Country}">${Data.Address.Country}</option>`,
                PAN_Number : Data.Documents.PAN_Number,
                Aadhaar_Number : Data.Documents.Aadhaar_Number,
                IMG : `/sellers_assistant/authorised/seller_documents/${Data.Documents.IMG}`,
                
                Bank_Name: Data.Bank.Bank_Name,
                Beneficiary_Name: Data.Bank.Beneficiary_Name,
                Account_Number: Data.Bank.Account_Number,
                IFSC_Code: Data.Bank.IFSC_Code,

                Shop_Name:Data.Store.Shop_Name,
                Shop_Contact_Number:Data.Store.Shop_Contact_Number,
                Worker_Number:Data.Store.Worker_Number,
                Shop_Category:Data.Store.Shop_Category,
                Shop_Location:Data.Store.Shop_Location,
                Shop_IMG : `/sellers_assistant/authorised/seller_documents/${encodeURIComponent(Data.Store.Shop_Photo)}`,
            }
            
            const List = Got_User.Employee_Work_Done;
            List.push({
                Desc: `Visited a profile.`,
                Ref: send.ID,
                Action: "Visited",
                More: "",
                Date: Date()
            });
            await Assistants.updateOne({_id:Got_User._id}, {$set:{
                Employee_Work_Done: List,
            }});
            res.status(200).render("Sellers_Assistant_Update",send);
        }else{
            res.status(200).send("User not found.");
        }
    } catch (error) {
        next(error);
    };
};

const Seller_Assistant_Profile = async ( req , res , next ) => {
    try {
        const Got_User = req.User;


        const User = Got_User;
        const date = User.createdAt;
        const Month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const DateCreated = `${date.getDate()}, ${Month[date.getMonth()]} ${date.getFullYear()}`;

        const Address = `${User.Address.Locality},<br>${User.Address.PIN}, ${User.Address.City_Town},<br> ${User.Address.Dist},<br> ${User.Address.State}, ${User.Address.Country}`;
        const Bank = `${User.Bank.Bank_Name},<br> ${User.Bank.Account_Number},<br> ${User.Bank.IFSC},<br> ${User.Bank.Benificiary_Name},<br> ${User.Bank.UPI}`;
        const send = {
            _id: User._id,
            Email: User.Email,
            Name: User.Basic_Details.Name,
            Mobile: User.Basic_Details.Mobile,
            WhatsApp: User.Basic_Details.WhatsApp,
            Employee_Type: User.Employee_Type,
            Ban: User.Ban,
            Verified: User.Verified,
            DateCreated: DateCreated,
            Gender: User.Gender,
            Age: User.Age,
            Acode: User.Acode,
            Address: Address,
            Bank: Bank,
        };
        res.status(200).render("Sellers_Assistant_Profile", send);
    } catch (error) {
        next(error);
    };
};


const Seller_Assistant_Search = async ( req , res , next ) => {
    try {
        const Got_User = req.User;
        return res.status(200).render("Sellers_Assistant_Search");
    } catch ( err ) {
        next(err);
    }
};

const Seller_Assistant_Shop_Status = async (req, res, next) => {
    try {
        return res.status(200).render("Sellers_Assistant_Shop_Status");
    }catch(e){
        next(e);
    };
};


const Seller_Assistant_Files_View = async (req, res, next) => {
    try {

        let FileName = req.params.File;


            
        let IMG = path.join(__dirname, "../Sellers_Files", FileName);

        if (fs.existsSync(IMG)) {
            res.sendFile(IMG, (err) => {
                if (err) {
                    res.status(500).send('Error while sending the file.');
                };
            });
        } else {
            res.status(404).send('File not found.');
        };
    }catch (e){
        next(e);
    };
};

const Seller_Assistant_Logout = async ( req , res , next ) => {
    try {
        res.clearCookie("SELLER_TOKEN",{
            domain: process.env.PROJECT_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: "strict",
        });

        const User = req.User;

        User.LoggedIn = {
            Token: "",
            Created: Date()
        };
        await User.save().then(()=>{
            return res.status(200).redirect("/sellers_assistant/login");
        });
    }catch (error) {
        next(error);
    };
};



module.exports = {
    Sellers_Assistant_Login,
    Sellers_Assistant_Login_OTP,
    Seller_Assistant_Home,
    Seller_Assistant_List,
    Seller_Assistant_Update,
    Seller_Assistant_Profile,
    Seller_Assistant_Search,
    Seller_Assistant_Shop_Status,
    Seller_Assistant_Files_View,
    Seller_Assistant_Logout,
};