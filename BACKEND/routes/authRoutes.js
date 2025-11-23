// ===== DEPENDENCIAS Y CONFIGURACIÓN =====
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); 

// ===== RUTAS =====
// Ruta de registro de usuario
router.post("/register", authController.register);

//Ruta de login
router.post("/login", authController.login);

// ===== EXPORTACIÓN DE RUTAS =====
module.exports = router;