import { pool } from "../config/db.js";

export async function getActivePromotions(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, title, description, active, created_at
       FROM promotions
       WHERE active = true
       ORDER BY created_at DESC`
    );

    return res.json({ promotions: result.rows });
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo promociones",
      error: error.message
    });
  }
}

export async function getAllPromotions(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, title, description, active, created_at
       FROM promotions
       ORDER BY created_at DESC`
    );

    return res.json({ promotions: result.rows });
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo promociones",
      error: error.message
    });
  }
}

export async function createPromotion(req, res) {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "El título es obligatorio"
      });
    }

    const result = await pool.query(
      `INSERT INTO promotions (title, description, active)
       VALUES ($1, $2, true)
       RETURNING *`,
      [title, description || ""]
    );

    return res.status(201).json({
      message: "Promoción creada correctamente",
      promotion: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creando promoción",
      error: error.message
    });
  }
}

export async function updatePromotion(req, res) {
  try {
    const { id } = req.params;
    const { title, description, active } = req.body;

    const result = await pool.query(
      `UPDATE promotions
       SET title = $1,
           description = $2,
           active = $3
       WHERE id = $4
       RETURNING *`,
      [title, description || "", active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Promoción no encontrada"
      });
    }

    return res.json({
      message: "Promoción actualizada correctamente",
      promotion: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error actualizando promoción",
      error: error.message
    });
  }
}

export async function togglePromotion(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE promotions
       SET active = NOT active
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Promoción no encontrada"
      });
    }

    return res.json({
      message: "Estado de promoción actualizado",
      promotion: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error cambiando estado de promoción",
      error: error.message
    });
  }
}

export async function deletePromotion(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM promotions
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Promoción no encontrada"
      });
    }

    return res.json({
      message: "Promoción eliminada correctamente",
      promotion: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error eliminando promoción",
      error: error.message
    });
  }
}