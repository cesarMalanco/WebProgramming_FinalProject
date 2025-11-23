// ===== DEPENDENCIAS Y CONFIGURACIÓN =====
const pool = require("../config/database");

// ===== OBJETO CAPTCHASESSION =====
const CaptchaSession = {
  // Crear un nuevo captcha
  async create(id, text) {
    await pool.query(
      "INSERT INTO captcha_sessions (id, text) VALUES (?, ?)",
      [id, text]
    );
  },

  // Buscar un captcha por id
  async findById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM captcha_sessions WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // Eliminar un captcha por id
  async delete(id) {
    await pool.query(
      "DELETE FROM captcha_sessions WHERE id = ?",
      [id]
    );
  }
};

// ===== EXPORTACIÓN DEL MODELO =====
module.exports = CaptchaSession;