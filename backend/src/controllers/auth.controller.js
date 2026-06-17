import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { sendVerificationEmail } from "../utils/email.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function registerCustomer(req, res) {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nombre, correo y contraseña son obligatorios"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Correo electrónico inválido"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    const exists = await pool.query(
      "SELECT id, email_verified FROM customers WHERE email = $1",
      [normalizedEmail]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({
        message: exists.rows[0].email_verified
          ? "Este correo ya está registrado"
          : "Este correo ya está registrado, pero falta verificarlo. Inicia sesión para continuar la verificación.",
        needsVerification: !exists.rows[0].email_verified,
        email: normalizedEmail
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO customers (name, phone, email, password, email_verified)
       VALUES ($1, $2, $3, $4, false)
       RETURNING id, name, phone, email, email_verified, created_at`,
      [name.trim(), phone || null, normalizedEmail, hashedPassword]
    );

    const customer = result.rows[0];

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `UPDATE email_verification_codes
       SET used = true
       WHERE email = $1
       AND used = false`,
      [normalizedEmail]
    );

    await pool.query(
      `INSERT INTO email_verification_codes 
       (customer_id, email, code, expires_at, used)
       VALUES ($1, $2, $3, $4, false)`,
      [customer.id, normalizedEmail, code, expiresAt]
    );

    await sendVerificationEmail(normalizedEmail, code);

    return res.status(201).json({
      message: "Cuenta creada. Revisa tu correo para verificarla.",
      customer
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error registrando cliente",
      error: error.message
    });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        message: "Correo y código son obligatorios"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const result = await pool.query(
      `SELECT *
       FROM email_verification_codes
       WHERE email = $1
       AND code = $2
       AND used = false
       ORDER BY created_at DESC
       LIMIT 1`,
      [normalizedEmail, cleanCode]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Código inválido"
      });
    }

    const verification = result.rows[0];

    if (new Date(verification.expires_at) < new Date()) {
      return res.status(400).json({
        message: "El código ha expirado"
      });
    }

    await pool.query(
      "UPDATE customers SET email_verified = true WHERE id = $1",
      [verification.customer_id]
    );

    await pool.query(
      "UPDATE email_verification_codes SET used = true WHERE id = $1",
      [verification.id]
    );

    return res.json({
      message: "Correo verificado correctamente",
      email: normalizedEmail
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error verificando correo",
      error: error.message
    });
  }
}

export async function loginCustomer(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Correo y contraseña son obligatorios"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      "SELECT * FROM customers WHERE email = $1",
      [normalizedEmail]
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

    if (!customer.email_verified) {
      return res.status(403).json({
        message: "Debes verificar tu correo antes de iniciar sesión",
        needsVerification: true,
        email: customer.email
      });
    }

    const token = jwt.sign(
      {
        id: customer.id,
        role: "customer"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
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
    return res.status(500).json({
      message: "Error iniciando sesión",
      error: error.message
    });
  }
}
