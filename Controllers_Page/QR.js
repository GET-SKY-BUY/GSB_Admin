require("dotenv").config();
const { Verify_Token } = require("../utils/JWT.js");
const { Sellers , Assistants , Qr_Codes } = require("../Models.js");


const QR_ID = async ( req , res , next ) => {
    try {
        const ADMIN_TOKEN = req.signedCookies.SELLER_STORE;
        const Check = Verify_Token(ADMIN_TOKEN);
        let Found = false;
        let Search;
        if(Check){
            Search = await Sellers.findById(Check.ID).populate("Assistant_ID");
            if(Search){
                if(Search.LoggedIn.Token === Check.Token){
                    Found = true;
                };
            };
        };
        if(!Found){
            const ADMIN_TOKEN = req.signedCookies.SELLER_TOKEN;
            const Check = Verify_Token(ADMIN_TOKEN);
            let Search1;
            if(Check){
                Search1 = await Assistants.findById(Check.ID);
                if(Search1){
                    if(Search1.LoggedIn.Token === Check.Token){
                        Found = true;
                    };
                };
            };
            if(!Found){
                res.clearCookie("SELLER_TOKEN",{
                    domain: process.env.PROJECT_DOMAIN,
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    signed: true,
                    sameSite: "strict",
                });
                return res.status(401).redirect("/sellers_store/login");
            };
        };
        

        // True
        const ID = req.params.ID;
        const Searcha = await Qr_Codes.findById("GSB1234");
        if(!Searcha){
            return res.status(404).send("QR CODE NOT FOUND...: " + ID);
        };

        Searcha.Active_Codes.forEach(element => {
            if(element.ID === ID){
                return res.status(200).send("FOUND QR CODE...:", ID);
            }
        });
        return res.status(404).send("QR CODE NOT FOUND...: " + ID);
        



    } catch (error) {
        next(error);
    };
};

module.exports = {
    QR_ID,

};