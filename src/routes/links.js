const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');

let object = 'links';
let tableName = 'links';
const id = 'link_id';

router.get('/add', isLoggedIn, (req, res) =>{
    res.render(object+'/add');
});

router.post('/add', isLoggedIn, async (req, res) =>{
    const { title, url, description } = req.body;
    const newObject = {
        title,
        url,
        description,
        user_id: req.user.user_id
    }; 
    await pool.query('INSERT INTO '+tableName+' SET ?', [newObject]);
    req.flash('success', object+' saved successfully');
    res.redirect('/'+object);
});

router.get('/', isLoggedIn, async (req, res) =>{ 
    const query = await pool.query('SELECT * FROM '+tableName+' WHERE user_id = ?', [req.user.user_id]);
    res.render(object+'/list', {query});
});

router.get('/delete/:'+id, isLoggedIn, async(req,res) =>{
    const { link_id } = req.params;
    await pool.query('DELETE FROM '+tableName+' WHERE '+id+' = ?', [link_id]);
    req.flash('warning', object+' remove successfully');
    res.redirect('/'+object);
});

router.get('/edit/:'+id, isLoggedIn, async(req,res) =>{
    const { link_id } = req.params;
    const query = await pool.query('SELECT * FROM '+tableName+' WHERE '+id+' = ?', [link_id]);
    res.render(object+'/edit', {link: query[0]});
});

router.post('/edit/:'+id, isLoggedIn, async(req, res) =>{
    const { link_id } = req.params;
    const { title, url, description } = req.body;
    const newObject = {
        title,
        url,
        description
    };
    await pool.query('UPDATE '+tableName+' SET ? WHERE '+id+' = ?', [newObject, link_id]);
    req.flash('success', object+' update successfully');
    res.redirect('/'+object);
});

module.exports = router;