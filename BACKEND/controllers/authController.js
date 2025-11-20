// ===== DEPENDENCIAS Y CONFIGURACIÓN =====
const User = require("../models/User");
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ===== FUNCIONES =====
exports.register = async (req, res) => {
  try {
    const {name, email, password, country} = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "El correo no es válido" });
    }

    // Validar datos de entrada
    if (!name || !email || !password || !country) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findByEmail(email);
    if(existingUser){
        return res.status(400).json({message: "El usuario ya existe"});
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const userId = await User.createUser({name, email, password: hashedPassword, country});

    // Generar un token JWT
    const token = jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: "1h"});

    res.status(200).json({message: "Usuario registrado con éxito", token});
    console.log("¡Usuario registrado exitosamente!");

  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({message: "Error al registrar el usuario"});
  }
};
