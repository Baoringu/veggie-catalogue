document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search');
    const loginButton = document.getElementById('login-button');
    const adminButton = document.getElementById('admin-button');

    // Zkontroluj, zda je uživatel přihlášen
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (token) {
        // Pokud je uživatel přihlášen, změň text tlačítka na "Logout"
        loginButton.textContent = 'Logout';

        // Pokud je role admin, zobraz tlačítko Admin Page
        if (role === 'admin') {
            adminButton.style.display = 'block';  // Zobrazení admin tlačítka
        } else {
            adminButton.style.display = 'none';
        }
    } else {
        // Pokud není přihlášen, tlačítko má text Login
        loginButton.textContent = 'Login';
        adminButton.style.display = 'none'; // Skrytí admin tlačítka, pokud není admin
    }

    // Akce pro tlačítko Login/Logout
    loginButton.addEventListener('click', () => {
        if (token) {
            // Pokud je uživatel přihlášen, logout
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            window.location.href = '/login.html';  // Přesměrování na login stránku
        } else {
            // Pokud není přihlášen, přihlášení
            window.location.href = '/login.html';  // Přejde na přihlašovací stránku
        }
    });

    // Ovládání tlačítka pro navigaci do administrativní stránky
    adminButton.addEventListener('click', () => {
        window.location.href = '/admin.html';
    });

    // Funkce pro načtení produktů
    function loadProducts() {
        fetch('/api/products')
            .then(response => response.json())
            .then(data => {
                productList.innerHTML = ''; // Vyprázdnění seznamu produktů
                data.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.innerHTML = `
                        <div class="sale-off">Sale Off - ${product.discount}%</div>
                        <div class="product-image"></div>
                        <h2>${product.name}</h2>
                        <p class="price">${product.price} Kč / 1Pc</p>
                        <p class="main-code">Main code: ${product.main_code}</p>
                        <p class="origin">Origin: ${product.origin}</p>
                        <p class="stock">Stock: ${product.stock}</p>
                    `;
                    productList.appendChild(productCard);
                });
            })
            .catch(error => console.error('Chyba při načítání produktů:', error));
    }

    // Načíst produkty při načtení stránky
    loadProducts();

    // Přidání funkce pro vyhledávání produktů
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        fetch('/api/products')
            .then(response => response.json())
            .then(data => {
                productList.innerHTML = '';
                data.filter(product => product.name.toLowerCase().includes(searchTerm))
                    .forEach(product => {
                        const productCard = document.createElement('div');
                        productCard.className = 'product-card';
                        productCard.innerHTML = `
                            <div class="sale-off">Sale Off - ${product.discount}%</div>
                            <div class="product-image"></div>
                            <h2>${product.name}</h2>
                            <p class="price">${product.price} Kč / 1Pc</p>
                            <p class="main-code">Main code: ${product.main_code}</p>
                            <p class="origin">Origin: ${product.origin}</p>
                            <p class="stock">Stock: ${product.stock}</p>
                        `;
                        productList.appendChild(productCard);
                    });
            })
            .catch(error => console.error('Chyba při vyhledávání produktů:', error));
    });

    // Kontrola přístupu na admin stránku
    if (window.location.pathname.includes('admin.html') && role !== 'admin') {
        window.location.href = '/index.html'; // Přesměrování na index stránku pro ne-admin uživatele
    }

    if (!token) {
        // Pokud není token, přesměruj na login stránku
        window.location.href = '/login.html';
    }
});
