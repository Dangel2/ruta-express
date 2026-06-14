import { pool } from "../config/db.js";

export async function getMyProfile(req, res) {
  try {
    const customerId = req.user.id;

    const result = await pool.query(
      `SELECT id, name, phone, email, created_at
       FROM customers
       WHERE id = $1`,
      [customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Cliente no encontrado"
      });
    }

    return res.json({
      customer: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo perfil",
      error: error.message
    });
  }
}

export async function updateMyProfile(req, res) {
  try {
    const customerId = req.user.id;
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message: "Nombre y teléfono son obligatorios"
      });
    }

    const result = await pool.query(
      `UPDATE customers
       SET name = $1, phone = $2
       WHERE id = $3
       RETURNING id, name, phone, email, created_at`,
      [name, phone, customerId]
    );

    return res.json({
      message: "Perfil actualizado correctamente",
      customer: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error actualizando perfil",
      error: error.message
    });
  }
}