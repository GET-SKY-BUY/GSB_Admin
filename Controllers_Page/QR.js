require("dotenv").config();
const { Verify_Token } = require("../utils/JWT.js");
const { Sellers , Assistants , Qr_Codes , Products } = require("../Models.js");


const QR_ID = async ( req , res , next ) => {
    try {
        const SELLER_STORE = req.signedCookies.SELLER_STORE;
        const Check = Verify_Token(SELLER_STORE);
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
            const SELLER_TOKEN = req.signedCookies.SELLER_TOKEN;
            const Check = Verify_Token(SELLER_TOKEN);
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
        const ID = req.params.ID.toUpperCase();

        const Product_Found = await Products.findById(ID);

        if(!Product_Found){
            return res.status(404).json({
                Message:"PRODUCT NOT FOUND"
            });
        };

        let Var = Product_Found.Varieties;

        let Varieties = "";

        for(let i=0;i<Var.length;i++){


            Varieties +=`
                <fieldset>
                    <legend>Variety</legend>
                    <label for="v${i}"> ${Var[i].Type} :- </label><input id="v${i}" value="${Var[i].Quantity}" type="number">
                    <br>
                    <button onclick="Change('${Var[i].Type}','v${i}');">Change</button>
                </fieldset>
            `;
        };

        return res.status(200).render("QR_Seller_Update",{
            Link: "https://www.getskybuy.in/products/"+Product_Found.URL,
            Title: Product_Found.Title,
            ID: ID,
            Varieties
        });

        



    } catch (error) {
        next(error);
    };
};

const QR_Update = async ( req , res , next ) => {
    try {
        const SELLER_STORE = req.signedCookies.SELLER_STORE;
        const Check = Verify_Token(SELLER_STORE);
        let Found = false;
        let Search;
        if(Check){
            Search = await Sellers.findById(Check.ID).populate("Assistant_ID");
            if(Search){
                if(Search.LoggedIn.Token === Check.Token){
                    Found = true;
                }else{
                    res.clearCookie("SELLER_STORE",{
                        domain: process.env.PROJECT_DOMAIN,
                        path: "/",
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        signed: true,
                        sameSite: "strict",
                    });
                    return res.status(401).json({
                        Message: "UNAUTHORIZED"
                    });
                };
            };
        };
        if(!Found){
            const SELLER_TOKEN = req.signedCookies.SELLER_TOKEN;
            const Check = Verify_Token(SELLER_TOKEN);
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
                return res.status(401).json({
                    Message: "UNAUTHORIZED"
                });
            };
        };

        

        let {ID, Variety_Type, Value } = req.body;

        ID = ID.toUpperCase();

        const Product_Found = await Products.findById(ID);

        if(!Product_Found){
            return res.status(404).json({
                Message: "PRODUCT NOT FOUND"
            });
        };
        
        // console.log(Product_Found);

        let Var = Product_Found.Varieties;
        
        let Q1Found = false;

        for(let i=0;i<Var.length;i++){
            if(Var[i].Type === Variety_Type){
                Q1Found = true;
                Var[i].Quantity = Value;
                break;
            };
        };

        if(!Q1Found){
            return res.status(404).json({
                Message: "VARIETY NOT FOUND"
            });
        };

        Product_Found.Varieties = Var;

        let Updated_Product = await Product_Found.save();

        // console.log(Updated_Product);

        return res.status(200).json({
            Message: "UPDATED"
        });

        

    } catch (error) {
        next(error);
    };
};

module.exports = {
    QR_ID,
    QR_Update,
};