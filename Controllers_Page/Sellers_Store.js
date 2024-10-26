require('dotenv').config();
const { Verify_Token } = require("../utils/JWT.js")

const { Sellers } = require("../Models.js");

const Sellers_Store_Login = async ( req , res , next ) => {
    try {

        const Recieved_Token = req.signedCookies.SELLER_STORE;
        if (Recieved_Token) {
            const Verify = Verify_Token(Recieved_Token);
            if (Verify) {
                if(Verify.ID){
                    let data = await Sellers.findById(Verify.ID);
                    if(data){
                        if(data.Logged_In.Token === Verify.Token){
                            return res.status(200).redirect('/sellers_store/')
                        };
                    };
                };
            };
        };

        return res.status(200).render("Sellers_Store_Login");


    } catch (error) {
        next(error);
    };
};

module.exports = {
    Sellers_Store_Login,
};