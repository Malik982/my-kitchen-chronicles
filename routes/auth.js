const express = require('express');
const router = express.Router();
const db = require('../db'); // Assume db is a module that handles database operations
const bcrypt = require('bcrypt');

//register
router.post('/register', async (req, res) => {
    try {
        const {name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({message: 'All fields required'});

        // Check if user already exists
        const [rows] = await db.query('SELECT id from user where email = ?', [email]);
        if (rows.length > 0) return res.status(409).json({message: 'email taken'});

        const hash = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [name, email, hash]);
        return res.json({success: true, message: 'User registered successfully'});
    }   catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Server error'});
    }
});

//login
router.post('/signin', async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) return res.status(400).json({message: 'All fields required'});

        const [rows] = await db.query('SELECT id, name, password FROM user where email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({message: 'Invalid email or password'});

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({message: 'Invalid email or password'});

        //create session
        req.session.userId = user.id;
        req.session.userName = user.name;

        return res.json({success: true, message: 'Login successful', name: user.name});

    }   catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

//logout 
router.post('/logout', (req, res) => { 
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: 'Could not log out'});
        res.clearCookie('connect.sid');
        res.json({ success: true, message: "Logged out successfully" });
    });
});

//delete account
router.delete('/delete', async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId)
            return res.status(401).json({ message: "Not logged in"});

        await db.query("DELETE FROM recipes WHERE user_id = ?", [userId]);

        await db.query("DELETE FROM user WHERE id = ?", [userId]);


        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            return res.json({success: true, message: "Account deleted"})
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error"})
    }
})

module.exports = router;