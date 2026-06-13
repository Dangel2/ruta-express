import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export async function registerCustomer(req, res) {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nombre, correo y contraseña son obligatorios"
      });
    }

    const exists = await pool.query(
      "SELECT id FROM customers WHERE email = $1",
      [email]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({
        message: "Este correo ya está registrado"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO customers (name, phone, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, phone, email, created_at`,
      [name, phone || null, email, hashedPassword]
    );

    res.status(201).json({
      message: "Cliente registrado correctamente",
      customer: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registrando cliente",
      error: error.message
    });
  }
}

export async function loginCustomer(req, res) {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM customers WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Credenciales incorrectas"
      });
    }

    const customer = result.rows[0];
    const validPassword = await bcrypt.compare(password, customer.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Credenciales incorrectas"
      });
    }

    const token = jwt.sign(
      { id: customer.id, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Inicio de sesión correcto",
      token,
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error iniciando sesión",
      error: error.message
    });
  }
}