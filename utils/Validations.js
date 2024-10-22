const Valid_Email = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};
const Valid_Password = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
};
const Valid_Mobile = (mobile) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(mobile);
};


module.exports = { Valid_Email, Valid_Mobile , Valid_Password };