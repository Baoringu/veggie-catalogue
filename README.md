# Veggie Catalogue

## 📌 Popis projektu

Veggie Catalogue je webová aplikace pro správu katalogu produktů. Obsahuje backend API postavené na **Node.js** a **Express.js**, které komunikuje s **MySQL databází**. Backend se stará o autentizaci uživatelů a správu produktů.

🔴 **Upozornění:** Tento projekt neobsahuje kompletní kód z důvodu vlastnictví firmy **Veggie**. Repozitář na GitHubu je pouze **demo verze**, která nemusí obsahovat všechny funkce finální live verze.

➡ **Live verzi aplikace si můžete prohlédnout zde:**
[Veggie Catalogue – Live](https://catalogue.vegandfood.com/pricelist/THAI86)

## 🚀 Technologie

- **Backend:** Node.js, Express.js, MySQL
- **Frontend:** HTML, CSS, JavaScript
- **Autentizace:** JWT (JSON Web Token), bcrypt
- **Middleware:** CORS, body-parser, cookie-parser

## 📂 Struktura projektu

```
veggie-catalogue/
│-- backend/
│   │-- middleware/
│   │   ├── authMiddleware.js
│   │-- models/
│   │   ├── products.js
│   │   ├── user.js
│   │-- routes/
│   │   ├── products.js
│   │   ├── auth.js
│   │-- database/
│   │   ├── db.js
│   │-- server.js
│   │-- package.json
│-- frontend/
│   │-- admin/
│   │   ├── admin.html
│   │   ├── admin.js
│   │-- login/
│   │   ├── login.html
│   │   ├── login.js
│   │-- register/
│   │   ├── register.html
│   │   ├── register.js
│   │-- index.html
│   │-- script.js
│   │-- styles.css
│   │-- package.json
```

## 📜 Soubory a jejich funkce

### 🖥 Backend

#### 1️⃣ Server (backend/server.js)

- Používá **Express.js** a připojuje se k **MySQL** databázi.
- Obsahuje middleware: **CORS, body-parser, cookie-parser**.
- Slouží jako backend API a obsluhuje statické soubory frontendové aplikace.
- Přesměrovává `/` na admin nebo hlavní stránku podle role uživatele.
- Registruje routy pro produkty, kategorie a autentizaci.
- Spouští server na portu **3000**.

#### 2️⃣ Produkty (backend/routes/products.js)

API pro správu produktů (**CRUD** operace):

- 📡 **GET /api/products** – seznam všech produktů.
- 📡 **GET /api/products/:id** – detail produktu.
- ✏ **POST /api/products** – přidání produktu (**JWT autentizace** nutná).
- 🔄 **PUT /api/products/:id** – úprava produktu (**JWT autentizace** nutná).
- 🗑 **DELETE /api/products/:id** – smazání produktu (**JWT autentizace** nutná).

#### 3️⃣ Autentizace (backend/routes/auth.js)

API pro přihlašování a registraci uživatelů:

- 👤 **POST /api/auth/login** – přihlášení uživatele (ověřuje **username** a **heslo**).
- 📝 **POST /api/auth/register** – registrace nového uživatele (**bcrypt** šifruje heslo).
- 🔒 **GET /api/auth/admin** – chráněná admin stránka (**ověřuje roli**).
- 👑 **POST /api/auth/admin/register** – registrace nového admina (**přístup pouze pro adminy**).

### 🎨 Frontend

#### 4️⃣ Admin (frontend/admin/)
- **admin.html** – Administrátorská stránka.
- **admin.js** – Správa funkcionalit administrátorského rozhraní.

#### 5️⃣ Přihlášení & Registrace (frontend/login & frontend/register)
- **login.html, login.js** – Přihlašovací formulář.
- **register.html, register.js** – Registrace nového uživatele.

#### 6️⃣ Hlavní stránka (frontend/index.html)
- Obsahuje katalog produktů.
- **script.js** – Správa dynamických funkcí frontendové aplikace.
- **styles.css** – Styly aplikace.

## 🛠 Instalace a spuštění

1. Naklonujte repozitář:
   ```bash
   git clone https://github.com/Baoringu/veggie-catalogue.git
   cd veggie-catalogue
   ```
2. Nainstalujte závislosti pro backend:
   ```bash
   cd backend
   npm install
   ```
3. Nainstalujte závislosti pro frontend:
   ```bash
   cd ../frontend
   npm install
   ```
4. Vytvořte `.env` soubor v backend složce s přístupovými údaji k databázi:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=heslo
   DB_NAME=veggie_catalogue
   JWT_SECRET=tvujtajnyklic
   ```
5. Spusťte backend server:
   ```bash
   cd backend
   node server.js
   ```
   nebo s nodemon (pokud máte nainstalovaný):
   ```bash
   nodemon server.js
   ```
6. Otevřete `frontend/index.html` v prohlížeči pro spuštění aplikace.

## 🔗 API Dokumentace

API odpovídá na požadavky ve formátu **JSON**. Pro testování můžete použít **Postman** nebo **cURL**.

## 📌 Autor

Vytvořil: **Baoringu**

---
SCREENSHOT DEMO A LIVE VERZE 


![Snímek obrazovky 2025-02-09 v 21 17 36](https://github.com/user-attachments/assets/477e9f3d-2d87-4fa1-9fb8-26dc45aa899a)

![image](https://github.com/user-attachments/assets/d3168b27-4b84-4c69-967a-05283dd4e28b)


![Snímek obrazovky 2025-02-09 v 21 20 49](https://github.com/user-attachments/assets/3a74c96a-51c0-49a1-bca8-b86e428e9e38)


![Snímek obrazovky 2025-02-09 v 21 23 02](https://github.com/user-attachments/assets/5203be4e-bb62-4f44-b888-5eb36c11aa2f)
![VEGGIE · 9 23pm · 02-09](https://github.com/user-attachments/assets/fabce333-6c19-4ddf-be70-23256e4f3239)
