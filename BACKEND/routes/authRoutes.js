// ===== DEPENDENCIAS Y CONFIGURACIÓN =====
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); 

// ===== RUTAS =====
// Ruta de registro de usuario
router.post("/register", authController.register);

/*/ Ruta de login
router.post("/login", authController.login);

// Ruta de logout
router.post("/logout", authController.logout);

// Ruta para refrescar token
router.post("/refresh-token", authController.refreshToken);

// Ruta de contraseña olvidada
router.post("/forgot-password", authController.forgotPassword);

// Ruta para recuperar contraseña
router.post("/reset-password", authController.resetPassword);

// Ruta para generar captcha
router.get("/generate-captcha", authController.generateCaptcha);

// Ruta para validar captcha
router.post("/validate-captcha", authController.validateCaptcha);

// Ruta para consultar el status del bloqueo
router.get("/check-lock-status/:email", authController.checkLockStatus);
*/
// ===== EXPORTACIÓN DE RUTAS =====
module.exports = router;