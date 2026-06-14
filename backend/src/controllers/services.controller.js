import { pool } from "../config/db.js";

export async function getActiveServices(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, name, price, active, created_at
       FROM services
       WHERE active = true
       ORDER BY id ASC`
    );

    return res.json({ services: result.rows });
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo servicios",
      error: error.message
    });
  }
}

export async function getAllServices(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, name, price, active, created_at
       FROM services
       ORDER BY id ASC`
    );

    return res.json({ services: result.rows });
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo servicios",
      error: error.message
    });
  }
}

export async function createService(req, res) {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Nombre y precio son obligatorios"
      });
    }

    const result = await pool.query(
      `INSERT INTO services (name, price, active)
       VALUES ($1, $2, true)
       RETURNING *`,
      [name, price]
    );

    return res.status(201).json({
      message: "Servicio creado correctamente",
      service: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creando servicio",
      error: error.message
    });
  }
}

export async function updateService(req, res) {
  try {
    const { id } = req.params;
    const { name, price, active } = req.body;

    const result = await pool.query(
      `UPDATE services
       SET name = $1,
           price = $2,
           active = $3
       WHERE id = $4
       RETURNING *`,
      [name, price, active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Servicio no encontrado"
      });
    }

    return res.json({
      message: "Servicio actualizado correctamente",
      service: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error actualizando servicio",
      error: error.message
    });
  }
}

export async function toggleService(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE services
       SET active = NOT active
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Servicio no encontrado"
      });
    }

    return res.json({
      message: "Estado del servicio actualizado",
      service: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error cambiando estado del servicio",
      error: error.message
    });
  }
}

export async function deleteService(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM services
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Servicio no encontrado"
      });
    }

    return res.json({
      message: "Servicio eliminado correctamente",
      service: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error eliminando servicio",
      error: error.message
    });
  }
}