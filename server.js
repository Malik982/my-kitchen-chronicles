require('dotenv').config();
const express = require("express");
const session = require("express-session")
const path = require("path");
const db = require('./db');

const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000*60*60*24 } // 1 day

}));

//serve uploads (images) and public frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

//API routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);


app.get('/api/profile', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(403).json({ error: "you are not logged in" });

    db.query("Select name, email From user Where id = ?", [userId], (err, user) => {
        if (err) return res.status(500).json({ error: "database error" });

        db.query("SELECT * FROM recipes WHERE user_id = ?", [userId], (err, recipes) => {
            if (err) return res.status(500).json({ error: "database error" });
            res.json ({
                user: user[0],
                recipes
            });
        });
    });
});



app.put('/api/recipes/:id', (req, res) => {
    const recipeId = req.params.id;
    const userId = req.session.userId;
    const { title, description, ingredients, instructions } = req.body;

    db.query("SELECT * FROM recipes WHERE id = ? AND user_id = ?", [recipeId, userId], (err, rows) => {
        if(rows.length === 0) {
            return res.status(403).json({ error: "you are not authorized to edit this recipe" });
        }
        db.query("UPDATE recipes SET title = ?, description = ?, ingredients = ?, instructions = ? WHERE id = ?",
            [title, description, ingredients, instructions, recipeId],
            (err) => {
                if (err) return res.status(500).json({ error: err });
                res.json({ success: true});
            }
        );
    });
});

app.delete('/api/recipes/:id', (req, res) => {
    const recipeId = req.params.id;
    const userId = req.session.userId;

    db.query("DELETE FROM recipes WHERE id = ? AND user_id = ?", [recipeId, userId], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ success: true });
    })
});



//Fallback to index.html for SPA-like behaviour
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "public", "/index.html"));
});


app.listen(PORT, () => {
    console.log(`Server is running at  http://localhost:${PORT}`);
});