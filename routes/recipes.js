const express = require('express');
const router = express.Router();
const db = require('../db'); // Assume db is a module that handles database operations
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

//multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage});

//middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (!req.session.userId) return res.status(401).json({message: 'unauthorized'});
    next();   
}       

//create recipe
router.post('/add_recipe', isAuthenticated, upload.array('images', 10), async (req, res) => {
    try {
        const userId = req.session.userId;
        
        const { title, description, ingredients, instructions } = req.body;

        if (!title || !ingredients || !instructions) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Extract filenames
        const images = req.files.map(f => f.filename);

        // Insert into DB
        await db.query(
            "INSERT INTO recipes (user_id, title, description, ingredients, instructions, images) VALUES (?, ?, ?, ?, ?, ?)",
            [userId, title, description, ingredients, instructions, JSON.stringify(images)]
        );

        res.json({ success: true, message: "Recipe added successfully!" });

    } catch (err) {
        console.error("ADD RECIPE ERROR:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

//list recipes
router.get('/recipes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT r.*, u.name AS author FROM recipes r JOIN user u ON u.id = r.user_id ORDER BY r.created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'})
        }
    });


//get recipe by id
router.get('/:id', async (req, res) => {
    try {
        const[rows] = await db.query('SELECT r.*, u.name as author FROM recipes r JOIN user u ON u.id = r.user_id WHERE r.id = ? ', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({message: 'Recipe not found'});
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});

    }
});

module.exports = router;