// ===== DEPENDENCIAS Y CONFIGURACIÓN =====
const pool = require("../config/database");

// ===== OBJETO USER =====
const User = {
    /**
     * Crea un nuevo usuario en la base de datos
     * 
     * @param {Object} userData - Datos del usuario (name, email, password)
     * @returns {Promise<number>} - Retorna el ID del usuario creado
     */
    async createUser(userData){
        const {name, email, password, country} = userData;

        const [result] = await pool.query(
            "INSERT INTO users (name, email, password, country) VALUES (?, ?, ?, ?)",
            [name, email, password, country]
        );

        return result.insertId; // Retorna el ID del usuario creado
    },

    /**
     * Busca un usuario por su correo electrónico
     * 
     * @param {string} email - Correo electrónico del usuario
     * @returns {Promise<Object|null>} - Retorna el usuario si se encuentra, o null si no existe
     */
    async findByEmail(email){
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        return rows.length > 0 ? rows[0] : null;
    },
};

// ===== EXPORTACIÓN DEL MODELO =====
module.exports = User;
