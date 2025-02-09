const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");  // Předpokládám, že máš připojení k MySQL v tomto souboru
const router = express.Router();
require("dotenv").config();  // Načítání tajného klíče z .env
const SECRET_KEY = process.env.JWT_SECRET_KEY || "tajnyklic";  // Tajný klíč pro JWT

// Middleware pro kontrolu autentizace
function checkAuth(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Nejste přihlášeni" });
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Neplatný token" });
        }
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    });
}

// Ochrana administrativní stránky
router.get("/admin", checkAuth, (req, res) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: "Nemáte přístup k této stránce" });
    }
    res.sendFile(__dirname + '/../frontend/admin/admin.html');
});
// Přihlášení uživatele
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    console.log('Zadané uživatelské jméno:', username);
    console.log('Zadané heslo:', password); // Log pro kontrolu

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        if (err) {
            console.error("Chyba při dotazu na DB:", err);
            return res.status(500).json({ error: "Chyba serveru" });
        }

        if (results.length === 0) {
            console.log("Uživatel nenalezen");
            return res.status(401).json({ error: "Neplatné přihlašovací údaje" });
        }

        const user = results[0];
        console.log('Uložené heslo:', user.password); // Log pro kontrolu

        // Ověření hesla - Zde by mělo být pouze porovnání, pokud nechcete hashování
        if (password === user.password) {
            console.log('Heslo je správné');
            const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
            res.cookie('token', token, { httpOnly: true });

            // Vrátíme odpověď s tokenem a rolí
            return res.json({ token, role: user.role });
        } else {
            console.log('Heslo nesouhlasí');
            return res.status(401).json({ error: "Neplatné přihlašovací údaje" });
        }
    });
});




// Registrace uživatele
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Uživatelské jméno a heslo jsou povinné" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query("INSERT INTO users (username, password, role) VALUES (?, ?, 'user')", [username, hashedPassword], (err) => {
        if (err) return res.status(500).json({ error: "Chyba při registraci uživatele" });
        res.json({ message: "Uživatel úspěšně zaregistrován" });
    });
});

// Ochrana registrace admina
router.post("/admin/register", checkAuth, async (req, res) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: "Nemáte přístup k této operaci" });
    }

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Uživatelské jméno a heslo jsou povinné" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query("INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')", [username, hashedPassword], (err) => {
        if (err) {
            return res.status(500).json({ error: "Chyba při vytváření admina" });
        }
        res.json({ message: "Nový admin úspěšně přidán" });
    });
});

module.exports = { router, checkAuth };
