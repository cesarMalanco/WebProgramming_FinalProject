// ===== DEPENDENCIAS Y CONFIGURACIÓN =====
require("dotenv").config();
const express = require("express");
const cors = require("./middlewares/corsMiddleware");
const pool = require("./config/database"); 
const authRoutes = require("./routes/authRoutes");

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