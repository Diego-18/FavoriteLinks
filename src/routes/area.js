const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');

const object = 'area';
const tableName = 'area';
const id = 'area_id';

router.get('/add', isLoggedIn, (req, res) => {
	res.render(`${object}/add`);
});

router.post('/add', isLoggedIn, async (req, res) => {
	const { name, description } = req.body;
	const newObject = {
		name,
		description,
		user_id: req.user.user_id,
	};
	await pool.query(`INSERT INTO ${tableName} SET ?`, [newObject]);
	req.flash('success', `${object} saved successfully`);
	res.redirect(`/${object}`);
});

router.get('/', isLoggedIn, async (req, res) => {
	const query = await pool.query(
		`SELECT * FROM ${tableName} WHERE user_id = ?`,
		[req.user.user_id]
	);
	res.render(`${object}/list`, { query });
});

router.get(`/delete/:${id}`, isLoggedIn, async (req, res) => {
	const { area_id } = req.params;
	await pool.query(`DELETE FROM ${tableName} WHERE ${id} = ?`, [area_id]);
	req.flash('warning', `${object} removed successfully`);
	res.redirect(`/${object}`);
});

router.get(`/edit/:${id}`, isLoggedIn, async (req, res) => {
	const { area_id } = req.params;
	const query = await pool.query(
		`SELECT * FROM ${tableName} WHERE ${id} = ?`,
		[area_id]
	);
	res.render(`${object}/edit`, { link: query[0] });
});

router.post(`/edit/:${id}`, isLoggedIn, async (req, res) => {
	const { area_id } = req.params;
	const { name, description } = req.body;
	const newObject = {
		name,
		description,
	};
	await pool.query(`UPDATE ${tableName} SET ? WHERE ${id} = ?`, [
		newObject,
		area_id,
	]);
	req.flash('success', `${object} updated successfully`);
	res.redirect(`/${object}`);
});

module.exports = router;
