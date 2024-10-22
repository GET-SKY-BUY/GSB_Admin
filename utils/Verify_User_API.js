const { Verify_Token } = require("./JWT.js");
const { User } = require("../Models.js");
const Verify_User_API = async ( req, res, next) => {
    try {
        
        let User1 = req.signedCookies.User;
        if(!User1) {
            return res.status(401).clearCookie("User",{path:"/"}).json({Success: "Failed" ,Message:"Unauthorized access."});
            
        };

        let Verify = Verify_Token(User1);
        if(!Verify) {
            return res.status(401).clearCookie("User",{path:"/"}).json({Success: "Failed" ,Message:"Unauthorized access."});
        };
        
        // Check if the user exists
        await User.findById(Verify.ID).then( user => {
            if (!user) {
                return res.status(401).clearCookie("User",{path:"/"}).json({Success: "Failed" ,Message:"Unauthorized access."});
            };

            if(!(user.LoggedIn.Token === Verify.Token)) {
                return res.status(401).clearCookie("User",{path:"/"}).json({Success: "Failed" ,Message:"Unauthorized access."});    
            };

            if(user.Verified === "No") {
                return res.status(401).clearCookie("User",{path:"/"}).json({Success: "Failed" ,Message:"Unauthorized access."});
            };

            if(user.Ban === "Yes") {
                return res.status(401).clearCookie("User",{path:"/"}).json({Success: "Failed" ,Message:"Unauthorized access."});
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
module.exports = Verify_User_API;