const bcrypt = require('bcryptjs');

module.exports = {
	encryptPassword: async (password) => {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	},

	matchPassword: async (password, savedPassword) => {
		try {
			return await bcrypt.compare(password, savedPassword);
		} catch (error) {
			console.error(error);
		}
	},
};
