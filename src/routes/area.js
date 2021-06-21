const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');

router.get('/add', isLoggedIn, (req, res) =>{
    res.render('area/add');
});

router.post('/add', isLoggedIn, async (req, res) =>{
    //console.log(req.body);
    const { name, description } = req.body;
    const newArea = {
        name,
        description,
        user_id: req.user.user_id
    };
    //console.log(newArea); 
    await pool.query('INSERT INTO area SET ?', [newArea]);
    //res.send('Received');
    req.flash('success', 'Area saved successfully');
    res.redirect('/area');
});

router.get('/', isLoggedIn, async (req, res) =>{ 
    const area = await pool.query('SELECT * FROM area WHERE user_id = ?', [req.user.user_id]);
    //console.log(area);
    res.render('area/list', {area});
});

router.get('/delete/:area_id', isLoggedIn, async(req,res) =>{
    const { area_id } = req.params;
    await pool.query('DELETE FROM area WHERE area_id = ?', [area_id]);
    req.flash('warning', 'Link remove successfully');
    res.redirect('/area');
});

router.get('/edit/:area_id', isLoggedIn, async(req,res) =>{
    const { area_id } = req.params;
    const area = await pool.query("SELECT * FROM area WHERE area_id = ?", [area_id]);
    res.render('area/edit', {area: area[0]});
});

router.post('/edit/:area_id', isLoggedIn, async(req, res) =>{
    const { area_id } = req.params;
    const { name, description } = req.body;
    const newArea = {
        name,
        description
    };
    //console.log(id);
    //console.log(newArea);
    await pool.query("UPDATE area SET ? WHERE area_id = ?", [newArea, area_id]);
    req.flash('success', 'Area update successfully');
    res.redirect('/area');
});

module.exports = router;