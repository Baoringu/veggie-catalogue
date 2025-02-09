document.getElementById("register-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            window.location.href = "/login.html";  // Po registraci přesměruj na login
        } else {
            alert("Chyba při registraci");
        }
    })
    .catch(error => console.error("Chyba při registraci:", error));
});
