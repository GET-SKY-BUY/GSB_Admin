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

    LoggedIn:{
        Token:{
            type: String,
        },
        Created: {
            type: Date,
        },
    },
    Payment:{type:Object, default:[]},
    Auth:{
        OTP: {
            type: String,
        },
        Token:{
            type: String,
        },
        OTP_Expiry:{
            type: Date,
        },
    },
    Bank:{type:Object},
    Age:{type:String},
    Gender:{type:String},
    Acode:{type:String},
    Address:{type:Object},
});



const Seller_Schema = new Schema({
    _id: {
        type:String,
    },
    Basic_Details:{
        First_Name: {
            type:String,
            required: true,
            trim:true,
            maxlength: 50,
        },
        Last_Name: {
            type:String,
            required: true,
            trim:true,
            maxlength: 50,
        },
        Mobile_Number: {
            type:String,
            required: true,
            trim:true,
            maxlength: 50,
        },
        Alt_Number: {
            type:String,
            required: true,
            trim:true,
            maxlength: 50,
        },
        Age: {
            type:Number,
            required: true,
            min: 15,
            max: 70,
        },
        Gender: {
            required: true,
            type: String,
            trim: true,
            enum: ['Male', 'Female', 'Other'],
        },
    },
    Email:{
        unique: true,
        type: String,
        required: true,
        default: "Unauthorized Creation",
        trim:true,
        match: /.+\@.+\..+/,
        lowercase: true,
        maxlength: 100,
    },
    Password:{
        type: String,
        required: true,
        default: "No Password Specified",
        trim:true,
    },
    Ban:{
        type: String,
        required: true,
        default: "No",
        trim: true,
        enum: ['Yes', 'No'],
    },
    Verified:{
        type: String,
        required: true,
        default: "No",
        trim: true,
        enum: ['Yes', 'No'],
    },
    Product_List:[
        {
            type: String,
            ref: 'Products',
        }
    ],
    Documents:{
        PAN_Number:{
            type:String,
            required: true,
            trim:true,
            maxlength: 10,
        },
        Aadhaar_Number:{
            type:String,
            required: true,
            trim:true,
            maxlength: 16,
        },
        IMG:{
            type:String,
            required: true,
        },
    },
    Store:{
        Shop_Name:{
            type:String,
            required: true,
            trim:true,
            maxlength: 30,
        },
        Shop_Contact_Number:{
            type:String,
            required: true,
            trim:true,
            maxlength: 10,
        },
        Worker_Number:{
            type:String,
            required: true,
            trim:true,
            maxlength: 10,
        },
        Shop_Category:{
            type:String,
            required: true,
        },
        Shop_Photo:{
            type:String,
            required: true,
            trim:true,
        },
        Total_Reviews:{type:Object},
        Shop_Location:{type:Object},
    },
    Market:{type:String, default:""},
    createdAt: {
        type: Date,
        immutable: true,
    },
    DayActive:{type:String},
    Assistant_ID:{
        type: String,
        ref: 'Assistants',
    },
    Bank:{
        Bank_Name:{
            type:String,
            required: true,
        },
        Beneficiary_Name:{
            type:String,
            required: true,
        },
        Account_Number:{
            type:String,
            required: true,
        },
        IFSC_Code:{
            type:String,
            required: true,
        },
    },
    Address:{
        Landmark: {
            type:String,
            required: true,
        },
        Locality: {
            type:String,
            required: true,
        },
        Town_City: {
            type:String,
            required: true,
        },
        PIN_Code: {
            type:String,
            required: true,
        },
        State: {
            type:String,
            required: true,
        },
        District: {
            type:String,
            required: true,
        },
        Country: {
            type:String,
            required: true,
        },
    },
    LoggedIn:{
        Token:{
            type:String,
        },
        Created:{
            type:Date,
        },
    },
    Auth:{
        OTP:{
            type:String,
        },
        OTP_Expiry:{
            type:Date,
        },
        Token:{
            type:String,
        },
    },
    Overview:{type:Object},
    Payment:{type:Object},

})




const Qrs = new Schema({
    _id: {
        type: String,
    },
    Created_QR_Codes: {
        type: Object,
        default: [],
    },
    Temporary_QR_Codes: {
        type: Object,
        default: [],
    },
    Active_Codes:[
        {
            ID: {
                type:String,
            },
            Date: {
                type:Date,
                default: Date.now(),
            },
        }
    ],
    Not_Active_QR_Codes: {
        type: Object,
        default: [],
    },
});




const Product_Schema = new Schema({
    _id: {
        type: String,
    },
    URL: {
        type: String,
        required: true,
        unique: true,
        
    },
    Varieties:[
        {
            _id: false,
            Type: {
                trim: true,
                type: String,
                maxlength: 15,
            },
            Quantity:{
                type:Number,
                min: 1,
            },
        },
    ],
    Verified:{
        type:String,
        required: true,
        default: "No",
        trim: true,
        enum: ['Yes', 'No'],
    },
    Seller_ID:{
        type: String,
        ref: 'sellers',
    },
    Assistant_ID:{
        type:String,
        ref: 'assistants',
    },
    Title:{
        type:String,
        required: true,
        trim:true,
    },
    Description:{
        type:String,
        required: true,
        trim:true,
    },
    
    Categories:{
        type:String,
    },
    
    Age_Group:{
        type:String,
    },
    
    Occasion:{
        type:String,
    },
    
    Gender:{
        type:String,
    },
    
    Delivery:{
        type:Number,
    },

    GSBCoins:{
        type:Number,
        default: 0,
    },
    COD:{
        type:String,
        default: "No",
        enum: ['Yes', 'No'],
    },
    Brand:{
        type:String,
    },
    Keywords:{
        type:Object,
    },
    
    Price: {
        MRP: {
            type:Number,
        },
        Selling_Price:{
            type:Number,
        },
        Our_Price: {
            type:Number,
        },
    },

    Table:{type:Object},
    Image_Videos:{
        Image:{
            type:Object,
        },
        Video:{
            type:Object,
        },
    },
    Reviews:[
        {
            Title: {
                type:String,
            },
            Description: {
                type:String,
            },
            Rating:{
                type:Number,
            },
            Date:{
                type:Date,
            },
            Verified:{
                type:String,
                default: "No",
                trim: true,
                enum: ['Yes', 'No'],
            },
            ID: {
                type:String,
                ref: "Users"
            },
            Order_ID: {
                type:String,
                ref: "Orders"
            },
        },
    ],
    QnA:[
        {
            Q: {
                type:String,
            },
            A:{
                type:String,
            },
            Date: {
                type:Date,
            },
            ID: {
                type:String,
                ref: "Users"
            },
        }
    ],
    Orders:[
        {
            type:String,
            ref: 'Orders',
        }
    ], 
});

const categorySchema = new Schema({
    _id: {
        type: String,
    },
    Categories: {
        type: Array,
    },
});

const User = Model("User", UserSchema);
const Admin_User = Model("Admin", Admin_User_Schema);
const Assistants = Model("Assistants", Admin_Assistant_Schema);
const Qr_Codes = Model("Qr_Codes", Qrs);
const Sellers = Model("Sellers", Seller_Schema);
const Products = Model("Products", Product_Schema);
const Categories = Model("Categories", categorySchema);





module.exports = {
    User,
    Admin_User,
    Assistants,
    Qr_Codes,
    Sellers,
    Products,
    Categories,
};