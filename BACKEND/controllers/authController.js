// ===== DEPENDENCIAS Y CONFIGURACIÓN =====
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const captchaService = require("../services/captchaService");

// ===== FUNCIONES =====
// Función para registrar usuario
exports.register = async (req, res) => {
  try {
    const { name, email, password, country } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "El correo no es válido" });
    }

    // Validar datos de entrada
    if (!name || !email || !password || !country) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const userId = await User.createUser({
      name,
      email,
      password: hashedPassword,
      country,
    });

    // Recuperar el usuario recién creado
    const user = await User.findByEmail(email);

    // Generar un token JWT
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Usuario registrado con éxito",
      token,
      name: user.name,
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

// Función para hacer login
exports.login = async (req, res) => {
  try {
    const { email, password, captchaId, captchaAnswer } = req.body;

    // Validar captcha
    const captchaResult = await captchaService.validateCaptcha(
      captchaId,
      captchaAnswer
    );
    if (!captchaResult.success) {
      return res.status(400).json({ message: "Captcha incorrecto o expirado" });
    }

    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Generar token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login exitoso", token, name: user.name });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};
