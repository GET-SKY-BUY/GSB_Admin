const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const SMPT_HOST = process.env.SMPT_HOST;
const MAIL_ID = process.env.MAIL_ID;
const MAIL_PASS = process.env.MAIL_PASS;

let Transporter = nodemailer.createTransport({
    host: SMPT_HOST,
    port: 465,
    secure: true,
    auth: {
        user: MAIL_ID,
        pass: MAIL_PASS
    }
});
const Send_Mail = async (MailOptions) => {


    try{
        let info = await Transporter.sendMail(MailOptions);
        if(info){
            return true;
        };
        return false;
    }catch (e){
        console.log(e);
        return false;
    }
}
module.exports = Send_Mail;