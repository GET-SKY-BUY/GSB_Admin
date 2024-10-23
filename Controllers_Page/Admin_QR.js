require('dotenv').config();

const QRCode = require('qrcode');

const ADMIN_PASS = process.env.ADMIN_PASS;
const { Verify_Token , Generate_Token } = require('../utils/JWT.js');
const { Admin_User , Assistants , Qr_Codes } = require('../Models.js');

function Product_ID() {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const length = 9;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    };
    return result;
};


const QR_DATA = async (TotalRequired)=>{
    let UniqueCodes = [];
    const Data = await QR.findOne({_id:"GSB1234"});
    const PresentQR = Data.Created_QR_Codes;
    for(let i = 0; i < TotalRequired; i++){
        let Code = Product_ID();
        let found = false;
        for(let j = 0; j < PresentQR.length; j++){
            if(PresentQR[j] == Code){
                found = true;
                break;
            };
        };
        if(found){
            i--;
        }else{
            UniqueCodes.push(Code);
        };
    };
    return UniqueCodes;
};




const QR_HOMEPAGE = async ( req , res , next )=>{
    try {
        const Data = await Qr_Codes.findOne({_id:"GSB1234"});
        return res.status(200).render("QR_Home",{
            QR_Generated: Data.Created_QR_Codes.length,
            Active_Generated: Data.Not_Active_QR_Codes.length,
            Active_Codes: Data.Active_Codes.length,
            Temp: Data.Temporary_QR_Codes.length,
        });
    } catch (error) {
        next(error);
    }
};



module.exports = {
    QR_HOMEPAGE,
}