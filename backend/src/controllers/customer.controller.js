import bcrypt from "bcryptjs";
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
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    return res.json({ customer: result.rows[0] });
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
      [name.trim(), phone.trim(), customerId]
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

export async function changeMyPassword(req, res) {
  try {
    const customerId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Completa todos los campos de contraseña"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "La nueva contraseña debe tener al menos 6 caracteres"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "La nueva contraseña y la confirmación no coinciden"
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "La nueva contraseña debe ser diferente a la actual"
      });
    }

    const customerResult = await pool.query(
      `SELECT id, password FROM customers WHERE id = $1`,
      [customerId]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      customerResult.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "La contraseña actual es incorrecta"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE customers SET password = $1 WHERE id = $2`,
      [hashedPassword, customerId]
    );

    return res.json({
      message: "Contraseña actualizada correctamente"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error cambiando contraseña",
      error: error.message
    });
  }
}
