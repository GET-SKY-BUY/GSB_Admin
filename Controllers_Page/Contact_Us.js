
const { Assistants , Contact_Us } = require('../Models.js');

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

        const User = req.User;

        let Unsolved_Contact = await Contact_Us.find({Solved: false});

        let LIST = "";

        

        for( let i = 0 ; i < Unsolved_Contact.length ; i++ ){

            
            let II = "";
            if(Unsolved_Contact[i].Managing_By.ID === ""){
                II = `<td><button type="button" onclick="Select('${Unsolved_Contact[i]._id}')">Select</button></td>`;
            }else if(Unsolved_Contact[i].Managing_By.ID === User._id){
                II = `<td>Selected</td>`;
            }else {
                II = `<td>Solving</td>`;
            }
            LIST +=` <tr>
                <td>${Unsolved_Contact[i].Name}</td>
                <td><a href="/contact_us/id/${Unsolved_Contact[i]._id}">${Unsolved_Contact[i].Contact_Number}</a></td>
                <td>${Unsolved_Contact[i].Reason}</td>
                ${II}
            </tr>`;
            
        }
        return res.status(200).render("Contact_Us_Home",{LIST}); 

    } catch ( error ) {
        next( error );
    };
};


const Contact_Us_By_Selected = async ( req , res , next ) => {
    try {

        const User = req.User;

        let Unsolved_Contact = await Contact_Us.find({
            Solved: false,
            "Managing_By.ID": User._id
        });

        let LIST = "";

        for( let i = 0 ; i < Unsolved_Contact.length ; i++ ){

            
            
            LIST +=` <tr>
                <td>${Unsolved_Contact[i].Name}</td>
                <td><a href="/contact_us/id/${Unsolved_Contact[i]._id}">${Unsolved_Contact[i].Contact_Number}</a></td>
                <td>${Unsolved_Contact[i].Reason}</td>
                <td>Selected</td>
            </tr>`;
            
        }
        return res.status(200).render("Contact_Us_Selected_List",{LIST}); 

    } catch ( error ) {
        next( error );
    };
};
const Contact_Us_By_Id = async ( req , res , next ) => {
    try {

        const User = req.User;

        const ID = req.params.ID;

        let Search = await Contact_Us.findById(ID);

        if(!Search){
            return res.status(404).send("ID Not Found");
        };

        if(Search.Managing_By.ID !== User._id){

            
            
            let S = {
                ID: Search._id,
                Status: Search.Solved? "Solved" : "Unsolved",
                Name: Search.Name,
                Contact: Search.Contact_Number,
                WhatsApp: Search.WhatsAppNumber,
                Gender: Search.Gender,
                Reason: Search.Reason,
                Problem: Search.Managing_By.Problem,
                Btns: "",
            };
            return res.status(200).render("Contact_Us_By_Id",S);
        };
        


        let S = {
            ID: Search._id,
            Status: Search.Solved? "Solved" : "Unsolved",
            Name: Search.Name,
            Contact: Search.Contact_Number,
            WhatsApp: Search.WhatsAppNumber,
            Gender: Search.Gender,
            Reason: Search.Reason,
            Problem: Search.Managing_By.Problem,
            Btns: `
            <li class="DIV">
                <textarea  id="Problem" cols="30" placeholder="Final reason/problem for contacting us." rows="10"></textarea><br>
                <button class="BT" type="button" onclick="Update('${Search._id}')">Update</button> <br><br> 
                <button class="Close_Ticket" type="button" onclick="Close_Ticket('${ID}')">Close</button>
            </li>
            
            `,
        };
        return res.status(200).render("Contact_Us_By_Id",S);



    } catch ( error ) {
        next( error );
    };
};


const Contact_Us_Profile = async ( req , res , next ) => {
    try {
        const User = req.User;
        
        let DateCreated = User.createdAt.toDateString();

        const Address = `${User.Address.Locality},<br>${User.Address.PIN}, ${User.Address.City_Town},<br> ${User.Address.Dist},<br> ${User.Address.State}, ${User.Address.Country}`;
        const Bank = `${User.Bank.Bank_Name},<br> ${User.Bank.Account_Number},<br> ${User.Bank.IFSC},<br> ${User.Bank.Benificiary_Name},<br> ${User.Bank.UPI}`;
        const send = {
            _id: User._id,
            Email: User.Email,
            Name: User.Basic_Details.Name,
            Mobile: User.Basic_Details.Mobile,
            WhatsApp: User.Basic_Details.WhatsApp,
            Employee_Type: User.Employee_Type,
            Ban: User.Ban,
            Verified: User.Verified,
            DateCreated: DateCreated,
            Gender: User.Gender,
            Age: User.Age,
            Acode: User.Acode,
            Address: Address,
            Bank: Bank,
        };
        res.status(200).render("Contact_Us_Profile", send);

    } catch ( error ) {
        next( error );
    };
};


const Contact_Us_Search = async ( req , res , next ) => {
    try {


        
    } catch ( error ) {
        next( error );
    };
};

module.exports = {
    Contact_Us_Login_Page,
    Contact_Us_Login_Page_OTP,
    Contact_Us_Home,
    Contact_Us_By_Id,
    Contact_Us_By_Selected,
    Contact_Us_Profile,
    Contact_Us_Search,
};