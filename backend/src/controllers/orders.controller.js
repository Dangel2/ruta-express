import { pool } from "../config/db.js";
import { sendNewOrderWhatsApp } from "../services/whatsappService.js";
import { io } from "../server.js";

export async function createOrder(req, res) {
  try {
    const customerId = req.user.id;

    const {
      origin,
      destination,
      description,
      price,

      origin_address,
      destination_address,

      origin_lat,
      origin_lng,

      destination_lat,
      destination_lng,

      price_type,
      distance_km
    } = req.body;

    const finalOrigin = origin || origin_address;
    const finalDestination = destination || destination_address;

    if (!finalOrigin || !finalDestination) {
      return res.status(400).json({
        message: "Origen y destino son obligatorios"
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        message: "La descripción del mandado es obligatoria"
      });
    }

    const result = await pool.query(
      `INSERT INTO orders (
        customer_id,
        origin,
        destination,
        description,
        price,
        status,
        origin_address,
        destination_address,
        origin_lat,
        origin_lng,
        destination_lat,
        destination_lng,
        price_type,
        distance_km
      )
      VALUES (
        $1, $2, $3, $4, $5,
        'Recibido',
        $6, $7, $8, $9, $10, $11,
        $12, $13
      )
      RETURNING *`,
      [
        customerId,
        finalOrigin,
        finalDestination,
        description.trim(),
        price || 0,

        origin_address || finalOrigin,
        destination_address || finalDestination,

        origin_lat || null,
        origin_lng || null,

        destination_lat || null,
        destination_lng || null,

        price_type || "fixed",
        distance_km || 0
      ]
    );

await pool.query(
  `INSERT INTO admin_notifications (
    order_id,
    viewed
  )
  VALUES ($1, false)`,
  [result.rows[0].id]
);

io.emit("new-order", {
  order: result.rows[0]
});

sendNewOrderWhatsApp(result.rows[0]);

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
       AND status != 'Cancelado'
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
       WHERE id = $1
       AND customer_id = $2`,
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

export async function cancelMyOrder(req, res) {
  try {
    const customerId = req.user.id;
    const { id } = req.params;

    const orderResult = await pool.query(
      `SELECT *
       FROM orders
       WHERE id = $1
       AND customer_id = $2`,
      [id, customerId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        message: "Pedido no encontrado"
      });
    }

    const order = orderResult.rows[0];

    if (!["Pendiente", "Recibido"].includes(order.status)) {
      return res.status(400).json({
        message:
          "Solo se pueden cancelar pedidos que aún no van en camino"
      });
    }

    const result = await pool.query(
      `UPDATE orders
       SET status = 'Cancelado'
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return res.json({
      message: "Pedido cancelado correctamente",
      order: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error cancelando pedido",
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
      "Recibido",
      "En camino",
      "Entregado",
      "Cancelado"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Estado inválido"
      });
    }

    const currentOrderResult = await pool.query(
      `SELECT *
       FROM orders
       WHERE id = $1`,
      [id]
    );

    if (currentOrderResult.rows.length === 0) {
      return res.status(404).json({
        message: "Pedido no encontrado"
      });
    }

    const currentOrder = currentOrderResult.rows[0];
    const statusOrder = ["Pendiente", "Recibido", "En camino", "Entregado"];

    if (status !== "Cancelado") {
      const currentIndex = statusOrder.indexOf(currentOrder.status);
      const nextIndex = statusOrder.indexOf(status);

      if (currentIndex !== -1 && nextIndex < currentIndex) {
        return res.status(400).json({
          message: "No se puede regresar a un estado anterior"
        });
      }
    }

    const result = await pool.query(
      `UPDATE orders
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

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