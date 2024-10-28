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


// Protocol 
let Protocol = "http";
if (process.env.NODE_ENV === 'production') {
    Protocol = 'https';
};

const Project_URL = `${Protocol}://${process.env.PROJECT_DOMAIN}`;


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
            Active_Codes: Data.Not_Active_QR_Codes.length,
            Active_Generated: Data.Active_Codes.length,
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
                    await Qr_Codes.updateOne({_id:"GSB1234"},{$set:{
                        Temporary_QR_Codes:a,
                    }}).then(()=>{
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

const QR_final = async ( req , res , next )=>{
    try{
        const Data = await Qr_Codes.findOne({_id:"GSB1234"});
        await Qr_Codes.updateOne({_id:"GSB1234"},{$set:{
            Created_QR_Codes: [...Data.Created_QR_Codes, ...Data.Temporary_QR_Codes],
            Not_Active_QR_Codes: [...Data.Not_Active_QR_Codes, ...Data.Temporary_QR_Codes],
            Temporary_QR_Codes: []
        }}).then(()=>{
            return res.status(200).json({Message: "Finalized"});
        }).catch(()=>{
            return res.status(400).json({Message: "Unable to finalize."});
        });
    }catch(e){
        next(e);
    };
};

const QR_Search = async ( req , res , next )=>{
    try{
        const Data = await Qr_Codes.findOne({_id:"GSB1234"});
        let QR1 = req.body.QR_CODE;
        if(QR1){
            QR1 = QR1.toUpperCase();
            for(let i = 0; i < Data.Created_QR_Codes.length; i++){
                if(Data.Created_QR_Codes[i] == QR1){
                    return res.status(200).json({Message: "Found QR - Code."});
                };
            };
            return res.status(404).json({Message: "Not Found"});
        }else{
            return res.status(400).json({Message: "Please provide the correct QR Code"});
        }
    }catch(e){
        next(e);
    };
};

const QR_Delete_QR = async ( req , res , next )=>{
    try{
        const Data = await Qr_Codes.findOne({_id:"GSB1234"});
        let QR1 = req.body.QR_CODE;
        if(QR1){
            QR1 = QR1.toUpperCase();
            let D = [];
            let found = false;
            for(let i = 0; i < Data.Created_QR_Codes.length; i++){
                if(Data.Created_QR_Codes[i] == QR1){
                    found = true;
                    continue;
                };
                D.push(Data.Created_QR_Codes[i]);
            };
            if(found){
                const AA = Data.Active_Codes;
                let foun = false;
                for(let i = 0; i < AA.length; i++){
                    if(AA[i] == QR1){
                        foun = true;
                        break;
                    };
                };
                if(foun){
                    return res.status(400).json({Message: "Cannot delete ACTIVE QR - Code"});
                };

                const BB = Data.Not_Active_QR_Codes;
                let ReList = [];
                for(let i = 0; i < BB.length; i++){
                    if(BB[i] != QR1){
                        ReList.push(BB[i]);
                    };
                };
                await Qr_Codes.updateOne({_id:"GSB1234"},{$set:{
                    Created_QR_Codes:D,
                    Not_Active_QR_Codes:ReList
                }}).then(()=>{
                    return res.status(200).json({Message: "Deleted, seleted QR - Code"});
                }).catch(()=>{
                    return res.status(500).json({Message: "Internal server error"});
                });
            }else{
                return res.status(404).json({Message: "QR Code not found"});
            };
        }else{
            return res.status(400).json({Message: "Please provide the correct QR Code"});
        };

    }catch(e){
        next(e);
    };
};

const QR_PAGE = async ( req , res , next ) => {
    try {
        const Options_For_QR = {
            version: 3,
            errorCorrectionLevel: 'L', 
            margin: 1,
            width: 200,
            color:{
                dark: '#000000',
                light: '#ffffff',
            },
        };











        let ST;
        async function AA(Create) {
            let D = [];
            for (let index = 0; index < Create.length; index++) {
                const element = Create[index];
                const dataUrl = await new Promise((resolve, reject) => {
                    QRCode.toDataURL(`${Project_URL}/qr/${element}`, Options_For_QR, (err, url) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(url);
                        }
                    });
                });
                D.push({ ID: element, Image: String(dataUrl) });
            };
            return D;
        }

        
        const Data = await Qr_Codes.findOne({_id:"GSB1234"});
        if(Data.Temporary_QR_Codes.length != 0){
            
            ST = await AA(Data.Temporary_QR_Codes);
            // ST = JSON.stringify(ST);
            const Final_JSON = ST;

            
            let DDDD = "";
            let Images = Final_JSON;
            // console.log(Images);
            for (let index = 0; index < Images.length; index++) {
                const element = Images[index];
                // console.log(element.ID);
                DDDD += `
                    <div class="QR">
                        <div class="TOP">GETSKYBUY.IN   <span class="Circle"></span></div>
                        <img src="${element.Image}" alt="Image">
                        <div class="CODE">${element.ID}</div>
                        <div class="Company">GET SKY BUY</div>
                    </div>
                `;
            };
            
            
            return res.status(200).render("QR_Page", {UniqueCodes: DDDD});

        }else{
            return res.status(400).json({Message: "Please generate the QR Codes first"});
        };
        
        
        
    } catch (error) {
        next(error);
    };
};


module.exports = {
    QR_HOMEPAGE,
    QR_code_Generate,
    QR_deleted,
    QR_final,
    QR_Search,
    QR_Delete_QR,
    QR_PAGE,
}