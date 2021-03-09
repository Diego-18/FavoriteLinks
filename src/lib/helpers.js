const bcrypt = require('bcryptjs');
const helpers = {};

// encryt password with bcrypt
helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

// compare password 
helpers.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error);
    }
};

module.exports = helpers;