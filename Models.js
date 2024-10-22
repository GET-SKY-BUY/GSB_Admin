require('dotenv').config();
const mongoose = require("mongoose");
const URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SUBDOMAIN}.mongodb.net/${process.env.DB_NAME}`;
mongoose.connect(URL);
const db = mongoose.connection;
db.on('error',(error) => {
    console.log('MongoDB connection error:');
});
db.once('open',() => {
    console.log('Connected to MongoDB database.');
});
const Schema = mongoose.Schema;
const Model = mongoose.model;

const UserSchema = new Schema({
    _id:{
        type: String,
    },
    Email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    Personal_Data:{
        First_Name: {
            type: String,
            trim: true,
        },
        Last_Name: {
            type: String,
            trim: true,
        },
        Mobile_Number: {
            type: String,
        },
        DOB: {
            type: Date,
        },
        Gender: {
            type: String,
            enum:["Male","Female","Other"]
        },
    },
    Ban:{
        type: String,
        required: true,
        default: "No",
        trim: true,
        enum: ['Yes', 'No'],
    },
    Verified:{
        type:String,
        required: true,
        default: "No",
        trim: true,
        enum: ['Yes', 'No'],
    },
    createdAt: {
        type: Date,
    },
    Auth:{
        OTP:{
            type: String,
            trim:true,
        },
        OTP_Expiry:{
            type: Date,
        },
        Token:{
            type: String,
            trim:true,
        }
    },
    LoggedIn:{
        Token:{
            type: String,
            trim: true,
        },
        Created:{
            type: Date,
        }
    },
    Cart:{type:Object},
    Buy_Now:{type:Object},
    Orders:{type:Object},
    Address:{
        Active_ID:{type:String},
        List:{type:Object},
    },
    Search_History:{type:Object},
    Product_History:{type:Object},
    Interested_Search:{type:Object},
    GSBCoins:{
        Available:{type:Number},
        Earned:{type:Number},
        History:{type:Object},
    },
    Favourite:{type:Object},
    Wishlist:{type:Object},
    Notification:{type:Object},
    Bank:{
        Bank_Name:{type: String, trim:true},
        Beneficiary_Name:{type: String, trim:true},
        Account_Number:{type: String, trim:true},
        IFSC_Code:{type: String, trim:true},
    },
    Refund:{type:Object},
    Overview:{type:Object},
    Password:{
        type: String,
        required: true,
        trim:true,
    },
});


const Admin_User_Schema = new Schema({
    _id:{
        type: String,
    },
    Email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    Token:{
        type: String,
    },
    Auth:{
        OTP:{
            type: String,
            trim:true,
        },
        OTP_Expiry:{
            type: Date,
        },
        Token:{
            type: String,
            trim:true,
        }
    }
});

const Admin_Assistant_Schema = new Schema({
    _id: {
        type:String,
    },
    Basic_Details:{
        Name: {type:String},
        Mobile: {type:String},
        WhatsApp: {type:String},

    },
    Employee_Type:{type:String},
    Employee_Work_Alloted:{type:Object, default:[]},
    Employee_Work_Done:{type:Object},
    Email:{
        type: String,
        required: true,
        trim:true,
    },
    Password:{
        type: String,
        required: true,
        trim:true,
    },
    Ban:{
        type:String,
        required: true,
        default: "No",
        trim:true,
        enum: ['Yes', 'No'],
    },
    Verified:{
        type:String,
        required: true,
        default: "No",
        trim: true,
        enum: ['Yes', 'No'],
    },
    createdAt: {
        type: Date,
    },

    LoggedIn:{type:Object},
    Payment:{type:Object, default:[]},
    Auth:{type:Object},
    Bank:{type:Object},
    Age:{type:String},
    Gender:{type:String},
    Acode:{type:String},
    Address:{type:Object},
});

const User = Model("User", UserSchema);
const Admin_User = Model("Admin", Admin_User_Schema);
const Assistant = Model("Assistant", Admin_Assistant_Schema);





module.exports = {
    User,
    Admin_User,
    Assistant,
}

