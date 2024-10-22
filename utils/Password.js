const argon2 = require('argon2');
require('dotenv').config();
const Sig = process.env.SERVER_SIGNATURE;
const Password_Hash = async (Password) => {
    const hashedPassword = await argon2.hash(Password + " | " +Sig);
    return hashedPassword;
};
const Password_Compare = async (Password, Hashed_Password) => {
    try {
        return await argon2.verify(Hashed_Password, Password + " | " +Sig);
    } catch {
        return false;
    };
};

module.exports = {
    Password_Hash,
    Password_Compare
};