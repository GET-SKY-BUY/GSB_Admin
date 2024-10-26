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
                        if(data.LoggedIn.Token === Verify.Token){
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

const Sellers_Store_Home = async ( req , res , next ) => {
    try{
        const Got_User = req.User;

        let a;
        if(Got_User.DayActive == "Yes"){
            a = `<button id="Active_Btn" class="Active_Btn" onclick="ActiveNow('${Got_User.DayActive}')" type="button">Deactive now</button>`;
            
        }else{
            a = `<button id="Active_Btn" class="Active_Btn" onclick="ActiveNow('${Got_User.DayActive}')" type="button">Active now</button>`;
        }
        const Options = {
            Assistant_No: Got_User.Assistant_ID.Basic_Details.Mobile,
            ID: Got_User._id,
            DayActive: Got_User.DayActive,
            Name: `${Got_User.Basic_Details.First_Name} ${Got_User.Basic_Details.Last_Name}`,
            Mobile_Number: Got_User.Basic_Details.Mobile_Number,
            Alt_Number: Got_User.Basic_Details.Alt_Number,
            Age: Got_User.Basic_Details.Age,
            Gender: Got_User.Basic_Details.Gender,
            Email: Got_User.Email,
            Ban: Got_User.Ban,
            Verified: Got_User.Verified,
            PAN_Number: Got_User.Documents.PAN_Number,
            Aadhaar_Number: Got_User.Documents.Aadhaar_Number,
            Shop_Name: Got_User.Store.Shop_Name,
            Shop_Contact_Number: Got_User.Store.Shop_Contact_Number,
            Worker_Number: Got_User.Store.Worker_Number,
            Shop_Category: Got_User.Store.Shop_Category,
            Shop_Location: Got_User.Store.Shop_Location,
            Created_On: Got_User.createdAt.toDateString() + " " + Got_User.createdAt.toLocaleTimeString(),
            
            Bank_Name: Got_User.Bank.Bank_Name,
            Benificiary_Name: Got_User.Bank.Benificiary_Name,
            Account_Number: Got_User.Bank.Account_Number,
            IFSC_Code: Got_User.Bank.IFSC_Code,

            Landmark: Got_User.Address.Landmark,
            Locality: Got_User.Address.Locality,
            Town_City: Got_User.Address.Town_City,
            PIN_Code: Got_User.Address.PIN_Code,
            State: Got_User.Address.State,
            District: Got_User.Address.District,
            Country: Got_User.Address.Country,

            Active_Now:a,


        };
        return res.status(200).render("Sellers_Store_Home", Options);

    }catch(error){
        next(error);
    };
};
module.exports = {
    Sellers_Store_Login,
    Sellers_Store_Home,
};