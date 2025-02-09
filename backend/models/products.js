app.post("/api/products", async (req, res) => {
    try {
        const { name, price, discount, category, stock, country, expiry_date } = req.body;
        
        if (!name || !price || !category || !stock) {
            return res.status(400).json({ error: "Vyplňte všechna povinná pole!" });
        }

        const newProduct = await db.query(
            "INSERT INTO products (name, price, discount, category, stock, country, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, price, discount, category, stock, country, expiry_date]
        );

        res.status(201).json({ message: "Produkt byl úspěšně přidán!", id: newProduct.insertId });
    } catch (error) {
        console.error("Chyba při ukládání produktu:", error);
        res.status(500).json({ error: "Chyba serveru" });
    }
});
