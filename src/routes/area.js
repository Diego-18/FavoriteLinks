const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');

router.get('/add', isLoggedIn, (req, res) =>{
    res.render('area/add');
});

router.post('/add', isLoggedIn, async (req, res) =>{
    //console.log(req.body);
    const { title, url, description } = req.body;
    const newLink = {
        title,
        description,
        user_id: req.user.id
    };
    //console.log(newLink); 
    await pool.query('INSERT INTO area SET ?', [newLink]);
    //res.send('Received');
    req.flash('success', 'Area saved successfully');
    res.redirect('/area');
});

router.get('/', isLoggedIn, async (req, res) =>{ 
    const area = await pool.query('SELECT * FROM area WHERE user_id = ?', [req.user.id]);
    //console.log(area);
    res.render('area/list', {area});
});

router.get('/delete/:id', isLoggedIn, async(req,res) =>{
    const { id } = req.params;
    await pool.query('DELETE FROM area WHERE ID = ?', [id]);
    req.flash('warning', 'Link remove successfully');
    res.redirect('/area');
});

router.get('/edit/:id', isLoggedIn, async(req,res) =>{
    const { id } = req.params;
    const area = await pool.query("SELECT * FROM area WHERE id = ?", [id]);
    res.render('area/edit', {area: area[0]});
});

router.post('/edit/:id', isLoggedIn, async(req, res) =>{
    const { id } = req.params;
    const { title, url, description } = req.body;
    const newLink = {
        title,
        description
    };
    //console.log(id);
    //console.log(newLink);
    await pool.query("UPDATE area SET ? WHERE id = ?", [newLink, id]);
    req.flash('success', 'Area update successfully');
    res.redirect('/area');
});

module.exports = router;