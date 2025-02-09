const mysql = require("mysql2");
require("dotenv").config();  // Načítání .env souboru

// Připojení k databázi
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "veggie_catalogue"
});

db.connect(err => {
    if (err) {
        console.error("Chyba připojení k databázi: " + err.message);
        process.exit(1);  // Ukončení aplikace při chybě připojení
    } else {
        console.log("Úspěšně připojeno k databázi.");
    }
});

module.exports = db;
