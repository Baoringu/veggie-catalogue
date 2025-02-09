document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const productTable = document.querySelector("#product-table tbody");
    const productForm = document.getElementById("product-form");
    const paginationDiv = document.getElementById("pagination");
    const categorySelect = document.getElementById("category");

    let products = [];
    let categories = [];
    let currentPage = 1;
    const productsPerPage = 15;

    // Funkce pro načítání produktů
    function fetchProducts() {
        fetch("http://localhost:3000/api/products", {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts();
            renderPagination();
        })
        .catch(error => console.error("Chyba při načítání produktů:", error));
    }

    // Funkce pro načítání kategorií
    function fetchCategories() {
        fetch("http://localhost:3000/api/categories", {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => {
            categories = data;
            renderCategories();
        })
        .catch(error => console.error("Chyba při načítání kategorií:", error));
    }

    // Funkce pro vykreslení kategorií do select
    function renderCategories() {
        categorySelect.innerHTML = ""; // Vymažeme předchozí možnosti
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;  // ID kategorie
            option.textContent = category.name;  // Název kategorie
            categorySelect.appendChild(option);
        });
    }

    // Funkce pro vykreslení produktů
    function renderProducts() {
        productTable.innerHTML = "";
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const paginatedProducts = products.slice(start, end);

        paginatedProducts.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
    <td>${product.id}</td>
    <td>${product.name}</td>
    <td>${product.price} Kč</td>
    <td>${product.discount || "0"} %</td>
    <td>${product.category ? product.category.name : "Neznámá kategorie"}</td> <!-- Ošetření null hodnoty -->
    <td>
        <button onclick="editProduct(${product.id})">✏️</button>
        <button onclick="deleteProduct(${product.id})">🗑️</button>
    </td>
`;

            productTable.appendChild(row);
        });
    }

    // Funkce pro vykreslení stránkování
    function renderPagination() {
        const paginationDiv = document.getElementById("pagination");
        if (!paginationDiv) {
            console.error("Element pro stránkování nebyl nalezen.");
            return;
        }
    
        paginationDiv.innerHTML = "";
        const totalPages = Math.ceil(products.length / productsPerPage);
    
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.addEventListener("click", () => {
                currentPage = i;
                renderProducts();
            });
            paginationDiv.appendChild(pageButton);
        }
    }
    

    // Odeslání formuláře (přidání nebo úprava produktu)
    productForm.addEventListener("submit", (event) => {
        event.preventDefault();
    
        const productId = document.getElementById("product-id").value;
        const name = document.getElementById("name").value;
        const price = document.getElementById("price").value;
        const discount = document.getElementById("discount").value || 0;
        const category = document.getElementById("category").value; // Zde použijeme ID kategorie
        const stock = document.getElementById("stock").value;
        const country = document.getElementById("country").value;
        const expiryDate = document.getElementById("expiry_date").value;
    
        // Validace formuláře
        if (!name || !price || !category || !stock || !country || !expiryDate) {
            alert("Vyplňte všechna povinná pole!");
            return;
        }
    
        const productData = { 
            name, 
            price, 
            discount, 
            category_id: category,  // POUŽITÍ KATEGORIE Z KONTROLY SELECT
            stock, 
            country, 
            expiry_date: expiryDate 
        };
    
        console.log("Odesílaná data:", productData); // Logování dat pro kontrolu
    
        if (productId) {
            // Úprava existujícího produktu
            fetch(`http://localhost:3000/api/products/${productId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(productData)
            })
            .then(response => response.json())
            .then(() => {
                productForm.reset();
                fetchProducts();
            })
            .catch(error => console.error("Chyba při úpravě produktu:", error));
        } else {
            // Přidání nového produktu
            fetch("http://localhost:3000/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(productData)
            })
            .then(response => response.json())
            .then(() => {
                productForm.reset();
                setTimeout(fetchProducts, 500); // Počkej 500ms a načti produkty znovu
            })
            .catch(error => console.error("Chyba při přidání produktu:", error));
        }
    });
    

    // Funkce pro úpravu produktu
    window.editProduct = (id) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        document.getElementById("product-id").value = product.id;
        document.getElementById("name").value = product.name;
        document.getElementById("price").value = product.price;
        document.getElementById("discount").value = product.discount;
        document.getElementById("category").value = product.category.id;  // Nastavení ID kategorie
        document.getElementById("stock").value = product.stock;
        document.getElementById("country").value = product.country;
        document.getElementById("expiry_date").value = product.expiry_date;
    };

    // Funkce pro smazání produktu
    window.deleteProduct = (id) => {
        fetch(`http://localhost:3000/api/products/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(() => {
            setTimeout(fetchProducts, 500); // Počkej 500ms a načti produkty znovu
        })
        .catch(error => console.error("Chyba při mazání produktu:", error));
    };

    // Logout
    document.getElementById("logout-button").addEventListener("click", () => {
        localStorage.removeItem("authToken");
        window.location.href = "login.html";
    });

    // Načítání produktů a kategorií při načtení stránky
    fetchCategories();
    fetchProducts();
});
