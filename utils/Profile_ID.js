const crypto = require('crypto');
const Profile_ID = () => {
    return crypto.randomInt(10000000000000, 99999999999999).toString();
};


module.exports = Profile_ID;