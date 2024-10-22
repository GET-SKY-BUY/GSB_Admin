const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

// JWT Options
const Opt = {
    expiresIn: '1d',
    issuer: "workspace.getskybuy.in",
    audience: "management",
    subject: "info@workspace.getskybuy.in",
    algorithm: "HS256",
};

// Generate Token
const Generate_Token = (payload) => {
    return jwt.sign(payload, JWT_SECRET, Opt);
};

// Verify Token
const Verify_Token = (token) => {
    try{
        return jwt.verify(token, JWT_SECRET, Opt);
    }catch(err){
        return null;
    };
};
module.exports = { Generate_Token, Verify_Token };