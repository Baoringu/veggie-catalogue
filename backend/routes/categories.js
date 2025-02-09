// routes/categories.js
const express = require("express");
const router = express.Router();
const db = require("../db"); // Odkaz na vaši DB připojení

// Endpoint pro získání všech kategorií
router.get("/", (req, res) => {
    const query = "SELECT * FROM categories";  // Předpokládám, že tabulka kategorie je "categories"
    db.query(query, (err, result) => {
        if (err) {
            console.error("Chyba při načítání kategorií:", err);
            return res.status(500).json({ error: "Chyba při načítání kategorií" });
        }
        res.json(result);  // Vrátí seznam kategorií
    });
});

module.exports = router;
