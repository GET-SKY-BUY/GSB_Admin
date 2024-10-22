
const crypto = require('crypto');

const Get_OTP = async () => {
    return crypto.randomInt(100000, 999999).toString();
}
const Get_Token = async () => {
    return crypto.randomBytes(32).toString('hex');
}
module.exports = {
    Get_OTP,
    Get_Token,
}
    

