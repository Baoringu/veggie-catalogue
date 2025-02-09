const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const PORT = 3000;
const productRoutes = require("./routes/products");
const { router: authRoutes, checkAuth } = require('./routes/auth');
const categoryRoutes = require("./routes/categories");  // Import kategorických rout

const app = express();

// Používáme CORS pro bezpečné sdílení dat mezi serverem a front-endem
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

// Statické soubory (CSS, JS, obrázky)
// Ensure that the path to your frontend folder is correct
app.use(express.static(path.join(__dirname, '../frontend'))); // Ensure 'frontend' folder is in the correct directory

// Připojení k MySQL databázi
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "veggie_catalogue"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.message);
        process.exit(1); // Ukončení aplikace v případě chyby
    } else {
        console.log("Connected to MySQL database.");
    }
});

// Middleware pro autentizaci
// If you want to apply it to all routes that need authentication, use this:
// app.use(checkAuth);

// Kořenová cesta - přesměrování na admin nebo hlavní stránku
app.get('/', (req, res) => {
    if (req.userRole === 'admin') {
        res.sendFile(path.resolve(__dirname, '../frontend/admin/admin.html')); // Ensure correct path
    } else {
        res.sendFile(path.resolve(__dirname, '../frontend/index.html')); // Ensure correct path
    }
});

// Login page route
app.get('/login.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/admin/login.html')); // Ensure correct path
});

// Definice rout pro produkty, kategorie a autentizaci
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);  // Předpokládám, že takto je API endpoint nastavený
app.use('/api/categories', categoryRoutes); // Přidání nové routy pro kategorie

// Spuštění serveru
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
