const mysql = require('mysql');
const { database } = require('./keys');
const { promisify } = require('util');

const pool = mysql.createPool(database);

function handleDatabaseConnectionError(err) {
	if (err) {
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			console.error('DATABASE CONNECTION WAS CLOSED');
		}
		if (err.code === 'ER_CON_COUNT_ERROR') {
			console.error('DATABASE HAS TOO MANY CONNECTIONS');
		}
		if (err.code === 'ECONNREFUSED') {
			console.error('DATABASE CONNECTION WAS REFUSED');
		}
	}
}

pool.getConnection((err, connection) => {
	handleDatabaseConnectionError(err);
	if (connection) {
		connection.release();
		console.log('DB is Connected');
	}
	return;
});

pool.query = promisify(pool.query);

module.exports = pool;
