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
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const admin = result.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
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
      LEFT JOIN customers ON orders.customer_id = customers.id
      ORDER BY orders.created_at DESC
    `);

    return res.json({ orders: result.rows });
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

    const validStatuses = ["Pendiente", "En camino", "Entregado", "Cancelado"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const result = await pool.query(
      `UPDATE orders
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Pedido no encontrado" });
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

export async function getAllCustomers(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, name, phone, email, created_at
       FROM customers
       ORDER BY created_at DESC`
    );

    return res.json({ customers: result.rows });
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo clientes",
      error: error.message
    });
  }
}

export async function getDashboardStats(req, res) {
  try {
    const totalOrders = await pool.query("SELECT COUNT(*) FROM orders");

    const pendingOrders = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE status = 'Pendiente'"
    );

    const onWayOrders = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE status = 'En camino'"
    );

    const deliveredOrders = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE status = 'Entregado'"
    );

    const canceledOrders = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE status = 'Cancelado'"
    );

    const totalCustomers = await pool.query(
      "SELECT COUNT(*) FROM customers"
    );

    const totalIncome = await pool.query(
      "SELECT COALESCE(SUM(price),0) AS total FROM orders WHERE status='Entregado'"
    );

    const todayIncome = await pool.query(`
      SELECT COALESCE(SUM(price),0) AS total
      FROM orders
      WHERE status='Entregado'
      AND DATE(created_at)=CURRENT_DATE
    `);

    const monthIncome = await pool.query(`
      SELECT COALESCE(SUM(price),0) AS total
      FROM orders
      WHERE status='Entregado'
      AND DATE_TRUNC('month', created_at)=DATE_TRUNC('month', CURRENT_DATE)
    `);

    const todayOrders = await pool.query(`
      SELECT COUNT(*)
      FROM orders
      WHERE DATE(created_at)=CURRENT_DATE
    `);

    const monthOrders = await pool.query(`
      SELECT COUNT(*)
      FROM orders
      WHERE DATE_TRUNC('month', created_at)=DATE_TRUNC('month', CURRENT_DATE)
    `);

    return res.json({
      totalOrders: Number(totalOrders.rows[0].count),
      pendingOrders: Number(pendingOrders.rows[0].count),
      onWayOrders: Number(onWayOrders.rows[0].count),
      deliveredOrders: Number(deliveredOrders.rows[0].count),
      canceledOrders: Number(canceledOrders.rows[0].count),
      totalCustomers: Number(totalCustomers.rows[0].count),

      totalIncome: Number(totalIncome.rows[0].total),
      todayIncome: Number(todayIncome.rows[0].total),
      monthIncome: Number(monthIncome.rows[0].total),

      todayOrders: Number(todayOrders.rows[0].count),
      monthOrders: Number(monthOrders.rows[0].count)
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo estadísticas",
      error: error.message
    });
  }
}