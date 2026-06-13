import { pool } from "../config/db.js";

export async function createOrder(req, res) {
  try {
    const customerId = req.user.id;
    const { origin, destination, description, price } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        message: "Origen y destino son obligatorios"
      });
    }

    const result = await pool.query(
      `INSERT INTO orders (customer_id, origin, destination, description, price, status)
       VALUES ($1, $2, $3, $4, $5, 'Pendiente')
       RETURNING *`,
      [customerId, origin, destination, description || "", price || 0]
    );

    return res.status(201).json({
      message: "Pedido creado correctamente",
      order: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creando pedido",
      error: error.message
    });
  }
}

export async function getMyOrders(req, res) {
  try {
    const customerId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM orders
       WHERE customer_id = $1
       ORDER BY created_at DESC`,
      [customerId]
    );

    return res.json({
      orders: result.rows
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo pedidos",
      error: error.message
    });
  }
}

export async function getOrderById(req, res) {
  try {
    const customerId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM orders
       WHERE id = $1 AND customer_id = $2`,
      [id, customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Pedido no encontrado"
      });
    }

    return res.json({
      order: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo pedido",
      error: error.message
    });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "Pendiente",
      "En camino",
      "Entregado",
      "Cancelado"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Estado inválido"
      });
    }

    const result = await pool.query(
      `UPDATE orders
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Pedido no encontrado"
      });
    }

    return res.json({
      message: "Estado actualizado correctamente",
      order: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error actualizando estado",
      error: error.message
    });
  }
}