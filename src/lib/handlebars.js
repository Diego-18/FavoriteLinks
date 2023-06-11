const { format } = require('timeago.js');

module.exports = {
	timeago: (timestamp) => format(timestamp),
};
