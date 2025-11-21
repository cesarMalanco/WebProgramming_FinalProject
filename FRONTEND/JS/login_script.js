// ===============================
//         LOGIN + CAPTCHA
// ===============================
let captchaId = "";

// Cargar captcha desde el servidor
async function loadCaptcha() {
    const res = await fetch("http://localhost:3000/api/captcha");
    const data = await res.json();
    captchaId = data.id;

    document.getElementById("captchaContainer").innerHTML = data.image;
}

loadCaptcha();

document.getElementById("login-btn").addEventListener("click", async (e) => {
    e.preventDefault(); // evita que recargue el form

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const answer = document.getElementById("captchaInput").value.trim();

    if (email === "" || password === "") {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Ingresa correo y contraseña",
        });
        return;
    }

    // Validar captcha
    const res = await fetch("http://localhost:3000/api/captcha/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: captchaId, answer })
    });

    const data = await res.json();

    if (!data.success) {
        Swal.fire({
            icon: "error",
            title: "Captcha incorrecto",
            text: "Inténtalo de nuevo",
        });

        loadCaptcha(); // recargar captcha si falla
        return;
    }

    // ====== CAPTCHA CORRECTO (login faltante con BD después) ======
    // Guardar usuario según "Recordarme"
    const remember = document.getElementById("rememberMe").checked;

    if (remember) {
        localStorage.setItem("currentUser", email);
    } else {
        sessionStorage.setItem("currentUser", email);   
    }

    Swal.fire({
        icon: "success",
        title: "Captcha correcto",
        text: "Sesión iniciada como: " + email,
    }).then(() => {
        location.reload(); // aplica preferencias
        // Redirigir a la página principal
        window.location.href = "/PAGES/index.html";
    });
});

// ===============================
//    ACCESIBILIDAD POR USUARIO
// ===============================
// Usuario actual
const userId = localStorage.getItem("currentUser") || "guest";
const FONT_KEY = `fontSize_${userId}`;
const THEME_KEY = `theme_${userId}`;
// Elementos
const icon = document.getElementById("accessibility-icon");
const panel = document.getElementById("accessibility-panel");
const increaseBtn = document.getElementById("increase-text");
const decreaseBtn = document.getElementById("decrease-text");
const themeBtn = document.getElementById("toggle-theme");
const resetBtn = document.getElementById("reset-accessibility");
// Variables con valores guardados
let fontSize = parseFloat(localStorage.getItem(FONT_KEY)) || 1;
let theme = localStorage.getItem(THEME_KEY) || "light";
function applyPreferences() {
    document.body.style.fontSize = fontSize + "rem";
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}
applyPreferences();
icon.addEventListener("click", () => {
    panel.classList.toggle("hidden");
});
increaseBtn.addEventListener("click", () => {
    fontSize += 0.1;
    document.body.style.fontSize = fontSize + "rem";
    localStorage.setItem(FONT_KEY, fontSize);
});
decreaseBtn.addEventListener("click", () => {
    fontSize -= 0.1;
    if (fontSize < 0.6) fontSize = 0.6;
    document.body.style.fontSize = fontSize + "rem";
    localStorage.setItem(FONT_KEY, fontSize);
});
themeBtn.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    localStorage.setItem(THEME_KEY, theme);
    applyPreferences();
});
resetBtn.addEventListener("click", () => {
    localStorage.removeItem(FONT_KEY);
    localStorage.removeItem(THEME_KEY);
    fontSize = 1;
    theme = "light";
    applyPreferences();
});