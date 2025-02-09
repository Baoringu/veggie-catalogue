const jwt = require('jsonwebtoken');
const SECRET_KEY = "tajnyklic";

function checkAuth(req, res, next) {
    // Vyloučení určitých cest z autentizace
    const excludedPaths = ['/login', '/register'];
    if (excludedPaths.includes(req.path)) {
        return next();
    }

    let token;
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.redirect('/login'); // Přesměrování na stránku pro přihlášení
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.redirect('/login'); // Přesměrování na stránku pro přihlášení
        }
        req.userId = decoded.userId;
        req.userRole = decoded.role; // Přidání role uživatele do requestu
        next();
    });
}

module.exports = checkAuth;