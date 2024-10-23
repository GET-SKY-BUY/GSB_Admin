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
    const Data = await Qr_Codes.findOne({_id:"GSB1234"});
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
    };
};

const QR_code_Generate = async ( req , res , next )=>{
    try {
        const Data = await Qr_Codes.findOne({_id:"GSB1234"});
        if(Data.Temporary_QR_Codes.length == 0){
            const TotalRequired = req.body.number;
            if(TotalRequired){
                if(TotalRequired > 0){
                    let a = await QR_DATA(TotalRequired);
                    await Qr_Codes.updateOne({_id:"GSB1234"},{$set:{Temporary_QR_Codes:a}}).then(()=>{
                        return res.status(200).json({Message:"QR Codes generated successfully." ,UniqueCodes: a});
                    }).catch(()=>{
                        return res.status(400).json({Message: "Error"});
                    });
                }else{
                    return res.status(400).json({Message: "Please provide the number of QR Codes you want to generate"});
                }
            }else{
                return res.status(400).json({Message: "Please provide the number of QR Codes you want to generate"});
            }
        }else{
            return res.status(400).json({Message: "What do you want to do with the previous QR Codes?"});
        }
    } catch (error) {
        next(error);
    }
};

const QR_deleted = async ( req , res , next )=>{
    try {
        await Qr_Codes.updateOne({_id:"GSB1234"},{$set:{Temporary_QR_Codes:[]}}).then(()=>{
            return res.status(200).json({Message: "Deleted"});
        }).catch(()=>{
            return res.status(400).json({Message: "Unable to delete"});
        });
    } catch (error) {
        next(error);
    };
};


module.exports = {
    QR_HOMEPAGE,
    QR_code_Generate,
    QR_deleted,
}