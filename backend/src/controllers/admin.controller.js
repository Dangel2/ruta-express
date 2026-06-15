import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Credenciales incorrectas"
      });
    }

    const admin = result.rows[0];

    const validPassword = await bcrypt.compare(
      password,
      admin.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Credenciales incorrectas"
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        role: "admin"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    return res.json({
      message: "Inicio de sesión admin correcto",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error iniciando sesión admin",
      error: error.message
    });
  }
}

export async function getAllOrders(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        orders.*,
        customers.name AS customer_name,
        customers.phone AS customer_phone,
        customers.email AS customer_email
      FROM orders
      LEFT JOIN customers
      ON orders.customer_id = customers.id
      ORDER BY orders.created_at DESC
    `);

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

export async function updateAdminOrderStatus(req, res) {
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

export async function deleteAdminOrder(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM orders
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Pedido no encontrado"
      });
    }

    return res.json({
      message: "Pedido eliminado correctamente",
      order: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error eliminando pedido",
      error: error.message
    });
  }
}

export async function getAllCustomers(req, res) {
  try {
    const result = await pool.query(
      `SELECT
         id,
         name,
         phone,
         email,
         created_at
       FROM customers
       ORDER BY created_at DESC`
    );

    return res.json({
      customers: result.rows
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo clientes",
      error: error.message
    });
  }
}

export async function getDashboardStats(req, res) {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(*) FILTER (
          WHERE DATE(created_at) =
          DATE(NOW() AT TIME ZONE 'America/Managua')
        ) AS today_orders,

        COUNT(*) FILTER (
          WHERE TRIM(status) = 'Pendiente'
          AND DATE(created_at) =
          DATE(NOW() AT TIME ZONE 'America/Managua')
        ) AS today_pending_orders,

        COUNT(*) FILTER (
          WHERE TRIM(status) = 'En camino'
          AND DATE(created_at) =
          DATE(NOW() AT TIME ZONE 'America/Managua')
        ) AS today_on_way_orders,

        COUNT(*) FILTER (
          WHERE TRIM(status) = 'Entregado'
          AND DATE(created_at) =
          DATE(NOW() AT TIME ZONE 'America/Managua')
        ) AS today_delivered_orders,

        COALESCE(SUM(price) FILTER (
          WHERE TRIM(status) = 'Entregado'
          AND DATE(created_at) =
          DATE(NOW() AT TIME ZONE 'America/Managua')
        ), 0) AS today_income,

        COUNT(*) FILTER (
          WHERE DATE_TRUNC('month', created_at) =
          DATE_TRUNC('month', NOW() AT TIME ZONE 'America/Managua')
        ) AS month_orders,

        COALESCE(SUM(price) FILTER (
          WHERE TRIM(status) = 'Entregado'
          AND DATE_TRUNC('month', created_at) =
          DATE_TRUNC('month', NOW() AT TIME ZONE 'America/Managua')
        ), 0) AS month_income,

        COALESCE(SUM(price) FILTER (
          WHERE TRIM(status) = 'Entregado'
        ), 0) AS total_income

      FROM orders
    `);

    const customers = await pool.query(
      `SELECT COUNT(*) FROM customers`
    );

    return res.json({
      todayOrders: Number(
        stats.rows[0].today_orders
      ),

      todayPendingOrders: Number(
        stats.rows[0].today_pending_orders
      ),

      todayOnWayOrders: Number(
        stats.rows[0].today_on_way_orders
      ),

      todayDeliveredOrders: Number(
        stats.rows[0].today_delivered_orders
      ),

      todayIncome: Number(
        stats.rows[0].today_income
      ),

      monthOrders: Number(
        stats.rows[0].month_orders
      ),

      monthIncome: Number(
        stats.rows[0].month_income
      ),

      totalCustomers: Number(
        customers.rows[0].count
      ),

      totalIncome: Number(
        stats.rows[0].total_income
      )
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo estadísticas",
      error: error.message
    });
  }
}