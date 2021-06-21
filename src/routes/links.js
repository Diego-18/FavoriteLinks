const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');

router.get('/add', isLoggedIn, (req, res) =>{
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) =>{
    //console.log(req.body);
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.user_id
    };
    //console.log(newLink); 
    await pool.query('INSERT INTO links SET ?', [newLink]);
    //res.send('Received');
    req.flash('success', 'Link saved successfully');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) =>{ 
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.user_id]);
    //console.log(links);
    res.render('links/list', {links});
});

router.get('/delete/:link_id', isLoggedIn, async(req,res) =>{
    const { link_id } = req.params;
    await pool.query('DELETE FROM links WHERE link_id = ?', [link_id]);
    req.flash('warning', 'Link remove successfully');
    res.redirect('/links');
});

router.get('/edit/:link_id', isLoggedIn, async(req,res) =>{
    const { link_id } = req.params;
    const link = await pool.query("SELECT * FROM links WHERE link_id = ?", [link_id]);
    res.render('links/edit', {link: link[0]});
});

router.post('/edit/:link_id', isLoggedIn, async(req, res) =>{
    const { link_id } = req.params;
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    //console.log(id);
    //console.log(newLink);
    await pool.query("UPDATE links SET ? WHERE link_id = ?", [newLink, link_id]);
    req.flash('success', 'Link update successfully');
    res.redirect('/links');
});

module.exports = router;