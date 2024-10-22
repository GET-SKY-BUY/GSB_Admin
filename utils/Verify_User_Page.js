const { Verify_Token } = require("./JWT.js");
const { User } = require("../Models.js");
const Verify_User_Page = async ( req, res, next) => {
    try {
        
        let User1 = req.signedCookies.User;
        if(!User1) {
            return res.status(401).clearCookie("User",{path:"/"}).redirect("/auth/login");
        };

        let Verify = Verify_Token(User1);
        if(!Verify) {
            return res.status(401).clearCookie("User",{path:"/"}).redirect("/auth/login");
        };
        
        // Check if the user exists
        await User.findById(Verify.ID).then( user => {
            if (!user) {
                return res.status(401).clearCookie("User",{path:"/"}).redirect("/auth/login");
            };

            if(!(user.LoggedIn.Token === Verify.Token)) {
                return res.status(401).clearCookie("User",{path:"/"}).redirect("/auth/login");    
            };

            if(user.Verified === "No") {
                return res.status(401).clearCookie("User",{path:"/"}).redirect("/auth/login");
            };

            if(user.Ban === "Yes") {
                return res.status(401).clearCookie("User",{path:"/"}).redirect("/auth/login");
            };

            req.User = user;
            next();
        }).catch((err) => {
            next(err);
        });
    } catch (err) {
        next(err);
    };
};
module.exports = Verify_User_Page;