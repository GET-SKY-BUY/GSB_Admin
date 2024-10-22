require('dotenv').config();
const ADMIN_PASS = process.env.ADMIN_PASS;
const { Verify_Token , Generate_Token } = require('../utils/JWT.js');
const { Admin_User , Assistants } = require('../Models.js');

const { Valid_Email, Valid_Password } = require('../utils/Validations.js');
const Send_Mail = require('../utils/Send_Mail.js');
const { Get_Token , Get_OTP } = require('../utils/Auth.js');


