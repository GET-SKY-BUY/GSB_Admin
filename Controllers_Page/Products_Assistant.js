require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { Verify_Token , Generate_Token } = require('../utils/JWT.js');

const { Sellers , Assistants, Categories , Products } = require('../Models.js');

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


const Products_Assistant_Login_Page = async ( req , res , next ) => {
    try {
        const Token = req.signedCookies.PRODUCT_TOKEN;
        if(Token){
            const User = Verify_Token(Token);
            if(User){
                let Search = await Assistants.findById(User.ID);
                if(Search){
                    if(Search.LoggedIn.Token === User.Token){
                        return res.redirect('/products_assistant');
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
        return res.status(200).render("Products_Assistant_Login");
    }catch (error) {
        next(error);
    };
};

const Products_Assistant_Login_Page_OTP = async ( req , res , next ) => {
    try {
        const Token = req.signedCookies.PRODUCT_TOKEN;
        if(Token){
            const User = Verify_Token(Token);
            if(User){
                let Search = await Assistants.findById(User.ID);
                if(Search){
                    if(Search.LoggedIn.Token === User.Token){
                        return res.redirect('/products_assistant');
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
        return res.status(200).render("Products_Assistant_Login_OTP");
    } catch (error) {
        next(error);
    };
};

const Product_Assistant_Home = async ( req , res , next ) => {
    try {
        
        return res.status(200).render("Product_Assistant_Home");
    }catch (error) {
        next(error);
    };
};

const Product_Assistant_Add = async ( req , res , next ) => {
    try {
        let a = await Categories.findById("GSB-Categories");
        if(!a){
            let b = new Categories({
                _id: "GSB-Categories",
                Categories: [],
            });
            await b.save();
            return res.status(404).send("Please try again");
        };
        let AA = "";
        a.Categories.forEach(element => {
            AA += `<option value="${element}">${element}</option>`;
        });
        return res.status(200).render("Product_Assistant_Add",{
            Categories:AA,
        });
    }catch (error) {
        next(error);
    };
};

const Product_Assistant_List = async ( req , res , next ) => {
    try {
        let data = await Products.find({});
        let List = "";
        for (let i = 0; i < data.length; i++) {
            let Element = data[i];
            let a =`<tr>
                    <td><a href="/products_assistant/update/${Element._id}">${Element._id}</a></td>
                    <td>${Element.Title}</td>
                    <td>${Element.Price.Our_Price}</td>
                    <td>${Element.Verified}</td>
                </tr>`;
            List = List + a;
        };

        return res.status(200).render("Product_Assistant_List",{
            List:List,
        });
    } catch (error) {
        next(error);
    };
};

const Product_Assistant_Logout = async ( req , res , next ) => {
    try {
        res.clearCookie("PRODUCT_TOKEN",{
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
            return res.status(200).redirect("/products_assistant/login");
        });
        
    } catch (error) {
        next(error);
    };
};

const Product_Assistant_Update = async ( req , res , next ) => {
    try {
        const Got_User = req.User;
        const ID = req.params.ID;
        let data = await Products.findById(ID).populate("Seller_ID").exec();
        if(data){

            let Var = data.Varieties;

            let Varieties = "";

            for (let i = 0; i < Var.length; i++) {



                Varieties += `
                    <div>
                        <div class="Div_Input2">
                            <input value="${Var[i].Type}" class="InputText2" id="V_Type${i}" title="Varities type" type="text" placeholder=" ">
                            <label class="Div_Input_Label2" for="V_Type${i}">Type</label>
                        </div>
                        <div class="Div_Input2">
                            <input value="${Var[i].Quantity}" class="InputText2" id="V_Qty${i}" title="Quantities" type="number" placeholder=" ">
                            <label class="Div_Input_Label2" for="V_Qty${i}">Quantity</label>
                        </div>
                    </div>
                
                `;

            };

            let a;
            let Table = data.Table;
            let Table1 = "";
            let i = 0;
            for (i = 0; i < Table.length; i++) {
                let Key = Table[i][0];
                let Val = Table[i][1];

                a = `
                    <div class="Table_Main_Box">

                        <div class="Div_Input2">
                            <input value="${Key}" class="InputText2" id="Key${i}" title="Key" type="text" placeholder=" ">
                            <label class="Div_Input_Label2" for="Key${i}">Key</label>
                        </div>
                        <div class="Div_Input2">
                            <input value="${Val}" class="InputText2" id="Value${i}" title="Value" type="text" placeholder=" ">
                            <label class="Div_Input_Label2" for="Value${i}">Value</label>
                        </div>
                    </div>`;
                Table1 = Table1 + a;
            };
            let Image = data.Image_Videos.Image;
            let Image1 = "";
            let x = 0;
            for (let i = 0; i < Image.length; i++) {
                let a = `
                    <div id="DivImage${i}">
                        <img src="/products/img/${Image[i]}" alt="Image" class="Images_Videos">
                        <button class="DeleteImage" type="button" onclick="DeleteImage('${Image[i]}',${i},'${data._id}')">Delete</button>
                    </div>
                `;
                x = i+1;
                Image1 = Image1 + a;
            };

            
            let Videos = data.Image_Videos.Video;
            let video1 = "";
            let y = 0;
            // console.log(Videos);
            if (Videos.length > 0 && Videos[0] != "") {
                for (let i = 0; i < Videos.length; i++) {
                    y++;
                    let iframe = createYouTubeIframe(Videos[i]);
                    video1 = video1 + `<div id="DivVideo${i}">`  + iframe + 
                    `<button class="DeleteVideos" type="button" onclick="DeleteVideos('${Videos[i]}',${i},'${data._id}')">Delete</button> </div>`;
                }
            }
            if(process.env.NODE_ENV == "development"){
                data["Protocol"] = "http";
            }else{
                data["Protocol"] = "https";
            }
            data["Domain"] = process.env.PROJECT_DOMAIN;
            data["N"] = i-1;
            data["Image_Len"] = x;
            data["Video_Len"] = y;
            data["B"] = Table1;
            data["Images"] = Image1;
            data["Videos"] = video1;
            let qa = await Categories.findById("GSB-Categories");
            if(!qa){
                let b = new Categories({
                    _id: "GSB-Categories",
                    Categories: [],
                });
                await b.save();
                return res.status(404).send("Please try again");
            };
            let AA = "";
            qa.Categories.forEach(element => {
                AA += `<option value="${element}">${element}</option>`;
            });
            data["Categories_List"] = AA;
            data["Varieties1"] = Varieties;
            data["V_BTN"] = data.Varieties.length - 1;
            return res.status(200).render("Product_Assistant_Update", data);
        }else{
            return res.status(404).send("Product not found.");
        };
    }catch (error) {
        next(error);
    };
};

module.exports = {
    Products_Assistant_Login_Page,
    Products_Assistant_Login_Page_OTP,
    Product_Assistant_Home,
    Product_Assistant_Add,
    Product_Assistant_List,
    Product_Assistant_Logout,
    Product_Assistant_Update,
};
