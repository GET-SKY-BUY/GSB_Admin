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


const SELLER_ASSISTANT_ADD_SELLER = async ( req , res , next ) => {

    try {

        async function deleteFiles(req) {
            console.log("Deleting Files");
            // console.log(req.files);
            try {
                let Img = path.join(__dirname, "../Sellers_Files", req.files.Img[0].filename);
                let Shop_Img = path.join(__dirname, "../Sellers_Files", req.files.Shop_Img[0].filename);
                await fs.unlinkSync(Img);
                await fs.unlinkSync(Shop_Img);
            } catch (err) {
                next(err);
            }
        }

        function File_Validation(req) {   
            re = 8;
            let Img = req.files.Img[0];
            let Shop_Img = req.files.Shop_Img[0];
            if(Img.size > 5242880){
                re = 1;
            }else if(Shop_Img.size > 5242880){
                re = 1;
            }else if(Img.mimetype != "image/png" && Img.mimetype != "image/jpeg" && Img.mimetype != "image/jpg" && Img.mimetype != "image/webp" && Img.mimetype != "image/heic"    ){
                re = 1;
            }else if(Shop_Img.mimetype != "image/png" && Shop_Img.mimetype != "image/jpeg" && Shop_Img.mimetype != "image/jpg" && Shop_Img.mimetype != "image/webp" && Shop_Img.mimetype != "image/heic"    ){
                re = 1;
            }else {
                return true;
            }
            if (re == 1) {
                return false;
            }else{
                return true;
            }
        };

        function Valid_Data(body) {
            let First_Name = body.First_Name;
            let Last_Name = body.Last_Name;
            let Mobile_Number = body.Mobile_Number;
            let Alt_Number = body.Alt_Number;
            let Age = body.Age;
            let Gender = body.Gender;
            let Email = body.Email;
            let Landmark = body.Landmark;
            let Locality = body.Locality;
            let Town_City = body.Town_City;
            let PIN_Code = body.PIN_Code;
            let inputState = body.inputState;
            let inputDistrict = body.inputDistrict;
            let Country = body.Country;
            let PAN_ID = body.PAN_ID;
            let Aadhaar_Number = body.Aadhaar_Number;
            let Bank_Name = body.Bank_Name;
            let Beneficiary_Name = body.Beneficiary_Name;
            let Account_Number = body.Account_Number;
            let IFSC_Code = body.IFSC_Code;
            let Shop_Name = body.Shop_Name;
            let Shop_Contact_Number = body.Shop_Contact_Number;
            let Worker_Number = body.Worker_Number;
            let Shop_Category = body.Shop_Category;
            let Shop_Location = body.Shop_Location;
            if (First_Name.length < 3 || First_Name == null) {
                return "Enter correct First name.";
            }else if (Last_Name.length < 3 || Last_Name == null) {
                return "Enter correct Last name.";
            }else if (Mobile_Number.length != 10 || !Valid_Mobile(Mobile_Number)) {
                return "Enter correct Mobile number.";
            }else if (Alt_Number.length != 10 || !Valid_Mobile(Alt_Number)) {
                return "Enter correct Alternative mobile number.";
            }else if (Age == null || Age == "") {
                return "Please enter correct age.";
            }else if (Number(Age) < 16 || Number(Age) > 50) {
                return "Age must be in between 16 to 50.";
            }else if (Gender !== "Male" && Gender !== "Female" && Gender !== "Other") {
                return "Please enter correct gender.";
            }else if (!Valid_Email(Email)) {
                return "Please enter correct Email.";
            }else if (Landmark.length < 3 ) {
                return "Please enter correct landmark.";
            }else if (Locality.length < 3 ) {
                return "Please enter correct Locality.";
            }else if (Town_City.length < 3 ) {
                return "Please enter correct Town/City.";
            }else if (PIN_Code.length != 6 ) {
                return "Please enter correct PIN code.";
            }else if (inputState.length < 3 ) {
                return "Please enter correct State.";
            }else if (inputDistrict.length < 3 ) {
                return "Please enter correct District.";
            }else if (Country.length < 3 ) {
                return "Please enter correct Country.";
            }else if (PAN_ID.length < 9 ) {
                return "Please enter correct PAN number";
            }else if (Aadhaar_Number.length != 16 ) {
                return "Please enter correct Aadhaar number";
            }else if (Bank_Name.length < 5 ) {
                return "Please enter correct Bank name.";
            }else if (Beneficiary_Name.length < 5 ) {
                return "Please enter valid Beneficiary name.";
            }else if (Account_Number.length < 5 ) {
                return "Please enter correct Account number.";
            }else if (IFSC_Code.length < 4 ) {
                return "Please enter correct IFSC CODE.";
            }else if (Shop_Name.length < 5 ) {
                return "Please enter correct Shop Name.";
            }else if (!Valid_Mobile(Shop_Contact_Number) ) {
                return "Please enter correct Shop contact number.";
            }else if (!Valid_Mobile(Worker_Number) ) {
                return "Please enter correct Worker contact number.";
            }else if (Shop_Category.length < 5 ) {
                return "Please enter correct shop Category.";
            }else if (Shop_Location.length < 5 ) {
                return "Please enter correct shop location.";
            }else{
                return "Valid";
            };
        };
        
        if (!File_Validation(req)) {
            deleteFiles(req);
            return res.status(200).json({Status:false, Message:"Please upload Valid file format."});
        }
        const Got_User = req.User;
        let T = Valid_Data(req.body);
        if (T == "Valid") {
            
            let body = req.body;
            let D = {
                First_Name: body.First_Name,
                Last_Name: body.Last_Name,
                Mobile_Number: body.Mobile_Number,
                Alt_Number: body.Alt_Number,
                Age: body.Age,
                Gender: body.Gender,
                Email: body.Email,
                Landmark: body.Landmark,
                Locality: body.Locality,
                Town_City: body.Town_City,
                PIN_Code: body.PIN_Code,
                inputState: body.inputState,
                inputDistrict: body.inputDistrict,
                Country: body.Country,
                PAN_ID: body.PAN_ID,
                Aadhaar_Number: body.Aadhaar_Number,
                Bank_Name: body.Bank_Name,
                Beneficiary_Name: body.Beneficiary_Name,
                Account_Number: body.Account_Number,
                IFSC_Code: body.IFSC_Code,
                Shop_Name: body.Shop_Name,
                Shop_Contact_Number: body.Shop_Contact_Number,
                Worker_Number: body.Worker_Number,
                Shop_Category: body.Shop_Category,
                Shop_Location: body.Shop_Location,
            };
            let MMMM = D.Email.trim().toLowerCase();
            let a = await Sellers.findOne({Email:MMMM});
            if(!a){

                let _idd;
                while(true){
                    _idd = await Profile_ID();
                    const Usersss = await Sellers.findOne({_id:_idd});
                    if(!Usersss){
                        break;
                    }
                    
                }

                let Pass = await Password_Hash(D.Mobile_Number);
                let Insert = {
                    _id: _idd,
                    Basic_Details:{
                        First_Name:D.First_Name,
                        Last_Name:D.Last_Name,
                        Mobile_Number:D.Mobile_Number,
                        Alt_Number:D.Alt_Number,
                        Age:D.Age,
                        Gender:D.Gender,
                    },
                    Email:MMMM,
                    Password:Pass,
                    Ban:"No",
                    Verified:"Yes",
                    Product_List:[],
                    Documents:{
                        PAN_Number: D.PAN_ID,
                        Aadhaar_Number: D.Aadhaar_Number,
                        IMG: req.files.Img[0].filename,
                    },
                    Store:{
                        Shop_Name: D.Shop_Name,
                        Shop_Contact_Number: D.Shop_Contact_Number,
                        Worker_Number: D.Worker_Number,
                        Shop_Category: D.Shop_Category,
                        Shop_Photo: req.files.Shop_Img[0].filename,
                        Total_Reviews:{},
                        Shop_Location: D.Shop_Location,
                    },
                    createdAt: Date(),
                    Assistant_ID: Got_User._id,
                    Markets: "",
                    Bank:{
                        Bank_Name: D.Bank_Name,
                        Beneficiary_Name: D.Beneficiary_Name,
                        Account_Number: D.Account_Number,
                        IFSC_Code: D.IFSC_Code,
                    },
                    Address: {
                        Landmark: D.Landmark,
                        Locality: D.Locality,
                        Town_City: D.Town_City,
                        PIN_Code: D.PIN_Code,
                        State: D.inputState,
                        District: D.inputDistrict,
                        Country: D.Country,
                    },
                    LoggedIn:{
                        Token:"",
                        Created: new Date(),
                    },
                    Auth:{
                        Token:"",
                        OTP:"",
                    },
                    Overview:{},
                    Payment:{},
                    DayActive:"No",
                    Payment:[]
                };
                let t = new Sellers(Insert);
                await t.save().then(async NewData=>{
                    
                    const List = Got_User.Employee_Work_Done;
                    List.push({
                        Desc: `Added new user`,
                        Ref: NewData._id,
                        Action:"Added",
                        More:"",
                        Date: Date()
                    });
                    await Assistants.updateOne({_id:Got_User._id}, {$set:{
                        Employee_Work_Done: List,
                    }});
                    return res.status(200).json({Status:true, Message:"Added Successfully."});
                    
                }).catch(async ()=>{
                    deleteFiles(req);
                    return res.status(500).json({Status:false, Message:"Unable to create account."});
                });
            }else{
                deleteFiles(req);
                return res.status(500).json({Status:false, Message:"Already have an account."});
            };  
        }else{
            deleteFiles(req);
            return res.status(400).json({Status:false, Message:T});
        };
    } catch (error) {
        deleteFiles(req);
        next(error);
    }
};

const SELLER_ASSISTANT_UPDATE = async ( req , res , next ) => {
    try {

        const Got_User = req.User;
        
        function Valid_Data(body) {
            let First_Name = body.First_Name;
            let Last_Name = body.Last_Name;
            let Mobile_Number = body.Mobile_Number;
            let Alt_Number = body.Alt_Number;
            let Age = body.Age;
            let Gender = body.Gender;
            let Landmark = body.Landmark;
            let Locality = body.Locality;
            let Town_City = body.Town_City;
            let PIN_Code = body.PIN_Code;
            let inputState = body.inputState;
            let inputDistrict = body.inputDistrict;
            let Country = body.Country;
            let Bank_Name = body.Bank_Name;
            let Beneficiary_Name = body.Beneficiary_Name;
            let Account_Number = body.Account_Number;
            let IFSC_Code = body.IFSC_Code;
            let Shop_Name = body.Shop_Name;
            let Shop_Contact_Number = body.Shop_Contact_Number;
            let Worker_Number = body.Worker_Number;
            let Shop_Category = body.Shop_Category;
            let Shop_Location = body.Shop_Location;
            if (First_Name.length < 3 || First_Name == null) {
                return "Enter correct First name.";
            }else if (Last_Name.length < 3 || Last_Name == null) {
                return "Enter correct Last name.";
            }else if (Mobile_Number.length != 10 || !Valid_Mobile(Mobile_Number)) {
                return "Enter correct Mobile number.";
            }else if (Alt_Number.length != 10 || !Valid_Mobile(Alt_Number)) {
                return "Enter correct Alternative mobile number.";
            }else if (Age == null || Age == "") {
                return "Please enter correct age.";
            }else if (Number(Age) < 16 || Number(Age) > 50) {
                return "Age must be in between 16 to 50.";
            }else if (Gender !== "Male" && Gender !== "Female" && Gender !== "Other") {
                return "Please enter correct gender.";
            }else if (Landmark.length < 3 ) {
                return "Please enter correct landmark.";
            }else if (Locality.length < 3 ) {
                return "Please enter correct Locality.";
            }else if (Town_City.length < 3 ) {
                return "Please enter correct Town/City.";
            }else if (PIN_Code.length != 6 ) {
                return "Please enter correct PIN code.";
            }else if (inputState.length < 3 ) {
                return "Please enter correct State.";
            }else if (inputDistrict.length < 3 ) {
                return "Please enter correct District.";
            }else if (Country.length < 3 ) {
                return "Please enter correct Country.";
            }else if (Bank_Name.length < 5 ) {
                return "Please enter correct Bank name.";
            }else if (Beneficiary_Name.length < 5 ) {
                return "Please enter valid Beneficiary name.";
            }else if (Account_Number.length < 5 ) {
                return "Please enter correct Account number.";
            }else if (IFSC_Code.length < 4 ) {
                return "Please enter correct IFSC CODE.";
            }else if (Shop_Name.length < 5 ) {
                return "Please enter correct Shop Name.";
            }else if (!Valid_Mobile(Shop_Contact_Number) ) {
                return "Please enter correct Shop contact number.";
            }else if (!Valid_Mobile(Worker_Number) ) {
                return "Please enter correct Worker contact number.";
            }else if (Shop_Category.length < 5 ) {
                return "Please enter correct shop Category.";
            }else if (Shop_Location.length < 5 ) {
                return "Please enter correct shop location.";
            }else{
                return "Valid";
            };
        };
        let T = Valid_Data(req.body);
        if (T == "Valid") {
            let body = req.body;
            let D = {
                First_Name: body.First_Name,
                Last_Name: body.Last_Name,
                Mobile_Number: body.Mobile_Number,
                Alt_Number: body.Alt_Number,
                Age: body.Age,
                Gender: body.Gender,
                Email: body.Email,
                Landmark: body.Landmark,
                Locality: body.Locality,
                Town_City: body.Town_City,
                PIN_Code: body.PIN_Code,
                inputState: body.inputState,
                inputDistrict: body.inputDistrict,
                Country: body.Country,
                PAN_ID: body.PAN_ID,
                Aadhaar_Number: body.Aadhaar_Number,
                Bank_Name: body.Bank_Name,
                Beneficiary_Name: body.Beneficiary_Name,
                Account_Number: body.Account_Number,
                IFSC_Code: body.IFSC_Code,
                Shop_Name: body.Shop_Name,
                Shop_Contact_Number: body.Shop_Contact_Number,
                Worker_Number: body.Worker_Number,
                Shop_Category: body.Shop_Category,
                Shop_Location: body.Shop_Location,
            };
            let a = await Sellers.findById(req.body.ID);
            if(a){
                let Insert = {
                    Basic_Details:{
                        First_Name:D.First_Name,
                        Last_Name:D.Last_Name,
                        Mobile_Number:D.Mobile_Number,
                        Alt_Number:D.Alt_Number,
                        Age:D.Age,
                        Gender:D.Gender,
                    },
                    Store:{
                        Shop_Name: D.Shop_Name,
                        Shop_Contact_Number: D.Shop_Contact_Number,
                        Worker_Number: D.Worker_Number,
                        Shop_Category: D.Shop_Category,
                        Shop_Photo: a.Store.Shop_Photo,
                        Total_Reviews:a.Store.Total_Reviews,
                        Shop_Location: D.Shop_Location,
                    },
                    Bank:{
                        Bank_Name: D.Bank_Name,
                        Beneficiary_Name: D.Beneficiary_Name,
                        Account_Number: D.Account_Number,
                        IFSC_Code: D.IFSC_Code,
                    },
                    Address: {
                        Landmark: D.Landmark,
                        Locality: D.Locality,
                        Town_City: D.Town_City,
                        PIN_Code: D.PIN_Code,
                        State: D.inputState,
                        District: D.inputDistrict,
                        Country: D.Country,
                    },
                };
                await Sellers.updateOne({_id:req.body.ID}, {$set:Insert}).then( async ()=>{

                    const List = Got_User.Employee_Work_Done;
                    List.push({
                        Desc: `Modified user data`,
                        Ref:req.body.ID,
                        Action:"Modified",
                        More:"",
                        Date: Date()
                    });
                    await Assistants.updateOne({_id:Got_User._id}, {$set:{
                        Employee_Work_Done: List,
                    }});
                    res.status(200).json({Status:true, Message:"Updated Successfully."});
                    
                }).catch(e=>{res.status(500).json({Status:false, Message:"Unable to update data."})});
            }else{
                res.status(400).json({Status:false, Message:"Wrong ID."});                  
            };
        }else{
            res.status(400).json({Status:false, Message:T});
        };
    } catch (error) {
        next(error);
    };
};

const SELLER_ASSISTANT_CHANGE_PASSWORD = async ( req , res , next ) => {
    try {

        const User = req.User;
        const {Old, New} = req.body;
        if (Old && New) {
            if (Valid_Password(New)) {
                if(Valid_Password(New)){
                    if ( await Password_Compare(Old, User.Password)) {
                        const NewPass = await Password_Hash(New);

                        const List = User.Employee_Work_Done;
                        List.push({
                            Desc: `Password changed`,
                            Ref: User._id,
                            Action:"Modified",
                            More:"",
                            Date: Date()
                        });

                        await Assistants.updateOne({_id:User._id}, {$set:{Password:NewPass, Employee_Work_Done: List}}).then(async ()=>{
                            return res.status(200).json({Success:"Success", Message:"Password changed successfully."});
                        }).catch( e =>{
                            return res.status(500).json({Success: "Failed", Message:"Internal server error, unable to change password."});

                        });
                    }else{
                        res.status(400).json({Success: "Failed", Message:"Old password is incorrect."});
                    };
                }else{
                    res.status(400).json({Success:"Failed", Message:"Password must contain atleast 1 uppercase, 1 lowercase and 1 number"});
                }
            }else{
                res.status(400).json({Success:"Failed", Message:"Password must contain atleast 1 uppercase, 1 lowercase and 1 number"});
            };
        }else{
            res.status(400).json({Success:"Failed", Message:"Please enter all fields."});
        };
    } catch (error) {
        next(error);
    };
};

module.exports = {
    SELLER_ASSISTANT_LOGIN,
    SELLER_ASSISTANT_LOGIN_OTP,
    SELLER_ASSISTANT_ADD_SELLER,
    SELLER_ASSISTANT_UPDATE,
    SELLER_ASSISTANT_CHANGE_PASSWORD,
};