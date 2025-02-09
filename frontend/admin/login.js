document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    console.log("Odesílám požadavek s uživatelem:", username);
    console.log("Heslo:", password);

    fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Chyba serveru: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Odpověď ze serveru:', data);

        if (data.token && data.role) {
            // Uložení tokenu a role do localStorage
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userRole", data.role);

            // Přesměrování na správnou stránku podle role
            if (data.role === "admin") {
                window.location.href = "admin/admin.html"; // Pokud je admin
            } else {
                window.location.href = "../index.html"; // Pokud je uživatel
            }
        } else {
            alert("Neplatné přihlašovací údaje");
        }
    })
    .catch(error => {
        console.error("Chyba při přihlášení:", error);
        alert("Došlo k chybě při přihlášení. Zkontrolujte konzoli pro více informací.");
    });
});
