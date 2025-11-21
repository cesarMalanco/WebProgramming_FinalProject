// ===== DEPENDENCIAS Y CONFIGURACIÓN =====
require("dotenv").config();
const express = require("express");
const cors = require("./middlewares/corsMiddleware");
const pool = require("./config/database"); 
const authRoutes = require("./routes/authRoutes");

const svgCaptcha = require("svg-captcha");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors);
app.use(express.json());

// ===== RUTA BASE =====
app.get("/", (req, res) => {
  res.send("¡API Rythmos funcionando correctamente!");
});

// ===== RUTAS DE AUTENTICACIÓN ===== 
app.use("/api/auth", authRoutes);

// ========== CAPTCHA ==================

// Almacén temporal de captchas (en memoria para pruebas)
const captchaStore = new Map();

// --- Generar CAPTCHA ---
app.get("/api/captcha", (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: false,
  });

  // ID único (en un sistema real usarías un token temporal)
  const captchaId = Date.now().toString();
  captchaStore.set(captchaId, captcha.text.toLowerCase());

  res.json({
    id: captchaId,
    image: captcha.data, // SVG en formato texto
  });
});

// --- Validar CAPTCHA ---
app.post("/api/captcha/validate", (req, res) => {
  const { id, answer } = req.body;

  if (!captchaStore.has(id)) {
    return res.status(400).json({ success: false, message: "Captcha expirado" });
  }

  const expected = captchaStore.get(id);
  captchaStore.delete(id); // Se elimina tras usarlo

  if (answer.toLowerCase() === expected) {
    return res.json({ success: true, message: "Captcha correcto" });
  } else {
    return res.status(400).json({ success: false, message: "Captcha incorrecto" });
  }
});

//======================================

// ===== FUNCIÓN DE PRUEBA MÍNIMA BD ===== 
async function testConnection(){
  try{
    const [rows] = await pool.query("SELECT 1 + 1 AS result"); //Le pide a MySQL que sume 1 + 1, y le ponga el alias result al valor obtenido
    console.log(
      " Conexión a la base de datos establecida. Resultado:",
      rows[0].result
    );
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error.message);
  }
}

// ===== INICIALIZACIÓN DEL SERVIDOR ===== 
app.listen(PORT, async () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  await testConnection();
});