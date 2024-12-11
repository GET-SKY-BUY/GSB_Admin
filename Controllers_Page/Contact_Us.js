
const { Assistants } = require('../Models.js');

const { Verify_Token , Generate_Token } = require('../utils/JWT.js');

const Contact_Us_Login_Page = async ( req , res , next ) => {
    try {
        const Token = req.signedCookies.CONTACT_US_TOKEN;
        if(Token){
            const User = Verify_Token(Token);
            if(User){
                let Search = await Assistants.findById(User.ID);
                if(Search){
                    if(Search.LoggedIn.Token === User.Token){
                        return res.redirect('/contact_us');
                    };
                };
            };
        };
        res.clearCookie("CONTACT_US_TOKEN",{
            domain: process.env.PROJECT_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: "strict",
        });
        return res.status(200).render("Contact_Us_Login_Page");
    } catch ( error ) {
        next( error );
    };
};

const Contact_Us_Login_Page_OTP = async ( req , res , next ) => {
    try {
        const Token = req.signedCookies.CONTACT_US_TOKEN;
        if(Token){
            const User = Verify_Token(Token);
            if(User){
                let Search = await Assistants.findById(User.ID);
                if(Search){
                    if(Search.LoggedIn.Token === User.Token){
                        return res.redirect('/contact_us');
                    };
                };
            };
        };
        res.clearCookie("CONTACT_US_TOKEN",{
            domain: process.env.PROJECT_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: "strict",
        });
        return res.status(200).render("Contact_Us_Login_OTP_Page");
    } catch ( error ) {
        next( error );
    };
};

const Contact_Us_Home = async ( req , res , next ) => {
    try {

    } catch ( error ) {
        next( error );
    };
};
// const Contact_Us_Login_Page = async ( req , res , next ) => {
//     try {

//     } catch ( error ) {
//         next( error );
//     };
// };

module.exports = {
    Contact_Us_Login_Page,
    Contact_Us_Login_Page_OTP,
    Contact_Us_Home,
};