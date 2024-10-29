require('dotenv').config();
const path = require('path');
const fs = require('fs');

const { Verify_Token , Generate_Token } = require('../utils/JWT.js');
const { Sellers, Assistants } = require('../Models.js');
const { Password_Compare , Password_Hash } = require('../utils/Password.js');
const { Get_Token , Get_OTP } = require('../utils/Auth.js');

const Send_Mail  = require('../utils/Send_Mail.js');

function URL_Generator(lengths = 21) {
    const character = "qw-ertyuioplkjhgfdsazxcvbnm1234567890";
    let varrr = 0, getRandom = 0, name = "";
    while (varrr <= lengths){
        getRandom = Math.floor(Math.random() * (character.length - 1));
        name = name + character[getRandom];
        varrr = varrr + 1;
    };
    return name;
};

function createYouTubeIframe(videoUrl) {
    const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^&\n]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    if (!videoId) {
        return null;
    };
    const iframeHTML = `
        <iframe class="IframeVideo" src="https://www.youtube.com/embed/${videoId}?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
    return iframeHTML;
};

const { Valid_Email, Valid_Password , Valid_Mobile } = require('../utils/Validations.js');

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

const PRODUCTS_ASSISTANT_LOGIN = async ( req , res , next ) => {
    try {
        const Token = req.signedCookies.PRODUCT_TOKEN;
        if(Token){
            const User = Verify_Token(Token);
            if(User){
                let Search = await Assistants.findById(User.ID);
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

        res.clearCookie("PRODUCT_TOKEN",{
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

        let Search = await Assistants.findOne({ Email: req.body.Email , Employee_Type: "Product Assistant" });
        if(!Search){
            return res.status(400).json({
                Status: "Failed",
                Message: "You don't have an account",
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
            from: "Product assistant - OTP" + "<" + process.env.MAIL_ID + ">",
            to: req.body.Email,
            subject: "OTP Verification - Product assistant",
            html: `Hello ${Search.Basic_Details.Name}, <br>Your OTP is ${OTP}. <br><br>It is valid for 5 minutes.`,
        });

        if(!Status){
            return res.status(400).json({
                Status: "Failed",
                Message: "Unable to sent OTP",
            });
        };

        await Search.save().then(() => {
            res.cookie("PRODUCT_OTP", NewToken, Cookie_Options_OTP);
            return res.status(200).json({
                Status: "Success",
                Message: "OTP Sent successfully",
            });
        });
    } catch (error) {
        next(error);
    };
};

const PRODUCTS_ASSISTANT_LOGIN_OTP = async ( req , res , next ) => {
    try {
        const Token = req.signedCookies.PRODUCT_TOKEN;
        if(Token){
            const User = Verify_Token(Token);
            if(User){
                let Search = await Assistants.findById(User.ID);
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

        res.clearCookie("PRODUCT_TOKEN",{
            domain: process.env.PROJECT_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: "strict",
        });

        const VerifyOTP_TOKEN = req.signedCookies.PRODUCT_OTP;
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
            from: "Product Assistant - Login" + "<" + process.env.MAIL_ID + ">",
            to: Search.Email,
            subject: "Product Assistant - Logged in",
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
            res.cookie("PRODUCT_TOKEN", NewToken, Cookie_Options_Final);
            res.clearCookie("PRODUCT_OTP",{
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



const PRODUCTS_ASSISTANT_SEARCH_SELLER = async ( req , res , next ) => {
    try {
        const body = req.body;
        let Type = body.Type;
        let Value = body.Value;
        if (Type && Value) {
            let data;
            if (Type == "Email") {
                data = await Sellers.findOne({Email:Value.toLowerCase()});
            }else if (Type == "Mobile") {
                data = await Sellers.findOne({"Basic_Details.Mobile_Number":Value});
            }else if (Type == "ID") {
                data = await Sellers.findById(Value);
            };
            if (data) {
                
                return res.status(200).json({
                    Message:"Seller found.",
                    ID:data._id,
                    Name:`${data.Basic_Details.First_Name} ${data.Basic_Details.Last_Name}`,
                    Mobile_Number:data.Basic_Details.Mobile_Number,
                    Email:data.Email,
                    Store_Name:data.Store.Shop_Name,
                });
            };  
            return res.status(400).json({Message:"Seller not found."});
        };
        return res.status(400).json({Message:"Enter all the fields."});
    } catch (error) {
        next(error);
    };
};


const PRODUCTS_ASSISTANT_ADD_PRODUCT = async ( req , res , next ) => {
    try {
        const body = Object.assign({}, req.body);
        const files = Object.assign({}, req.files);
        let da = await Sellers.findOne({_id: body.ID})
        if (da) {
            try {
                let k = body.Keywords;
                const Keywords = k.split(",");
                let l = body.Video_IDs;
                const VideoLinks = l.split(",");
                let T = body.Table;
                const Table1 = T.split(",");
                let Table = [];
                for (let i = 0; i < Table1.length; i += 2) {
                    Table.push([Table1[i], Table1[i + 1]]);
                };
                let ImageObj = [];
                for (let index = 1; index < 8; index++) {
                    let Image = `Image${index}`;
                    if (files[Image] && files[Image][0]) {
                        ImageObj.push(files[Image][0].filename);
                    };
                };
                let URL_Generatora;
                while(true){
                    URL_Generatora = URL_Generator();
                    let Data = await Products.findOne({URL:URL_Generator});
                    if (!Data) {
                        break                                                
                    };
                };
                let _idd;
                while(true){
                    _idd = Product_ID();
                    const Usersss = await Products.findOne({_id:_idd});
                    if(!Usersss){
                        break;
                    };
                };
                if (body.Title.length >= 3 &&
                    body.Description.length >= 3 &&
                    body.Selling_Price.length >= 1 &&
                    body.Categories.length >= 2 &&
                    body.Age_Group.length >= 2 &&
                    body.Occasion.length >= 2 &&
                    body.Gender.length >= 2 &&
                    body.Brand.length >= 1 &&
                    body.MRP.length >= 1) {
                    const Product = {
                        _id: _idd,
                        URL: URL_Generatora,
                        Verified: "No",
                        Seller_ID: da._id,
                        Assitant_ID: GetUser._id,
                        Title: body.Title,
                        Description: body.Description,
                        Price: {
                            MRP: Number(body.MRP),
                            Selling_Price: Number(body.Selling_Price),
                            Our_Price: 0,
                        },
                        Categories: body.Categories,
                        Age_Group: body.Age_Group,
                        Occasion: body.Occasion,
                        Gender: body.Gender,
                        Delivery: 0,
                        Quantity: Number(body.Quantity),
                        Brand: body.Brand,
                        Keywords: Keywords,
                        Table: Table,
                        Image_Videos: {
                            Image: ImageObj,
                            Video: VideoLinks,
                        },
                        GSBmail: 0,
                        COD: "No",
                        Reviews: [],
                        QnA: [],
                        Orders: [],
                    };
                    const SS = new Products(Product);
                    await SS.save().then(async()=>{
                        let Lisss = da.Product_List;
                        Lisss.push(Product._id);
                        await Seller_Profile.updateOne({_id:da._id},{$set:{
                            Product_List:Lisss,
                        }});
                        return res.status(200).json({Message:"Successfully added."});
                    }).catch(async ()=>{
                        await deleteFiles(files);
                        return res.status(400).json({Message:"Unable to add product."});
                    });
                }else{
                    await deleteFiles(files);
                    return res.status(400).json({Message:"Unauthorised access."});
                };
            }catch(error) {
                await deleteFiles(files);
                return res.status(400).json({Message:"Enable to add product."});
            };
        }else{
            await deleteFiles(files);
            return res.status(400).json({Message:"Invalid file format or size."});
        };
    } catch (error) {
        next(error);
    };
};


module.exports = {
    PRODUCTS_ASSISTANT_LOGIN,
    PRODUCTS_ASSISTANT_LOGIN_OTP,
    PRODUCTS_ASSISTANT_SEARCH_SELLER,
    PRODUCTS_ASSISTANT_ADD_PRODUCT,
};