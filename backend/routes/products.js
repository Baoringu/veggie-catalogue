const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "tajnyklic";

// Middleware pro ověření tokenu
function authMiddleware(req, res, next) {
    console.log("Authorization header:", req.headers.authorization);
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ error: "Přístup zamítnut" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Neplatný token" });
        req.userId = decoded.userId;
        next();
    });
}

// 🟢 Získání všech produktů
router.get("/", (req, res) => {
    console.log('📡 Handling GET request for /products');
    try {
        db.query("SELECT * FROM products", (err, results) => {
            if (err) {
                console.error('❌ Database query error:', err);
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('❌ Error handling GET request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 🟢 Získání jednoho produktu podle ID
router.get("/:id", (req, res) => {
    console.log(`📡 GET /products/${req.params.id}`);
    db.query("SELECT * FROM products WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Produkt nenalezen" });
        res.json(results[0]);
    });
});

// 🟢 Přidání nového produktu
router.post('/', (req, res) => {
    const { name, price, discount, category_id, stock, country, expiry_date } = req.body;

    // Zkontroluj, jestli jsou všechny povinné hodnoty
    if (!name || !price || !category_id || !stock || !country || !expiry_date) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // SQL dotaz pro vložení nového produktu
    const query = `INSERT INTO products (name, price, discount, category_id, stock, country, expiry_date) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [name, price, discount, category_id, stock, country, expiry_date], (err, result) => {
        if (err) {
            console.error("Error inserting product:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({ message: "Product added successfully" });
    });
});

// 🟢 Úprava produktu
router.put("/:id", authMiddleware, (req, res) => {
    console.log(`📩 PUT /api/products/${req.params.id} – data:`, req.body);

    const { name, price, discount, category, stock, country, expiry_date } = req.body;

    // Ověření vstupních dat
    if (!name || !price || !category || !stock) {
        return res.status(400).json({ error: "Vyplňte všechna povinná pole!" });
    }

    db.query(
        "UPDATE products SET name=?, price=?, discount=?, category=?, stock=?, country=?, expiry_date=? WHERE id=?",
        [name, price, discount ?? 0, category, stock, country ?? "", expiry_date ?? null, req.params.id],
        (err) => {
            if (err) {
                console.error("❌ Chyba při aktualizaci produktu:", err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "✅ Produkt aktualizován" });
        }
    );
});

// 🟢 Smazání produktu
router.delete("/:id", authMiddleware, (req, res) => {
    console.log(`🗑 DELETE /api/products/${req.params.id}`);

    db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
        if (err) {
            console.error("❌ Chyba při mazání produktu:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "✅ Produkt smazán" });
    });
});

module.exports = router;
