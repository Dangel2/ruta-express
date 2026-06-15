import { pool } from "../config/db.js";

const VALID_PRICE_TYPES = ["fixed", "distance"];

function normalizePriceType(priceType) {
  const normalizedType = String(priceType || "fixed")
    .trim()
    .toLowerCase();

  return VALID_PRICE_TYPES.includes(normalizedType)
    ? normalizedType
    : null;
}

function normalizeNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return 0;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

export async function getActiveServices(req, res) {
  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        price,
        price_type,
        price_per_km,
        active,
        created_at
       FROM services
       WHERE active = true
       ORDER BY id ASC`
    );

    return res.json({
      services: result.rows
    });
  } catch (error) {
    console.error("Error obteniendo servicios activos:", error);

    return res.status(500).json({
      message: "Error obteniendo servicios",
      error: error.message
    });
  }
}

export async function getAllServices(req, res) {
  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        price,
        price_type,
        price_per_km,
        active,
        created_at
       FROM services
       ORDER BY id ASC`
    );

    return res.json({
      services: result.rows
    });
  } catch (error) {
    console.error("Error obteniendo todos los servicios:", error);

    return res.status(500).json({
      message: "Error obteniendo servicios",
      error: error.message
    });
  }
}

export async function createService(req, res) {
  try {
    const {
      name,
      price,
      price_type,
      price_per_km
    } = req.body;

    const cleanName = String(name || "").trim();
    const cleanPriceType = normalizePriceType(price_type);
    const cleanPrice = normalizeNumber(price);
    const cleanPricePerKm = normalizeNumber(price_per_km);

    if (!cleanName) {
      return res.status(400).json({
        message: "El nombre del servicio es obligatorio"
      });
    }

    if (!cleanPriceType) {
      return res.status(400).json({
        message: "El tipo de tarifa debe ser fixed o distance"
      });
    }

    if (cleanPrice === null || cleanPrice < 0) {
      return res.status(400).json({
        message: "El precio debe ser un número válido"
      });
    }

    if (
      cleanPriceType === "distance" &&
      (cleanPricePerKm === null || cleanPricePerKm <= 0)
    ) {
      return res.status(400).json({
        message:
          "Los servicios por distancia necesitan un precio por kilómetro mayor que cero"
      });
    }

    const finalPricePerKm =
      cleanPriceType === "distance"
        ? cleanPricePerKm
        : 0;

    const result = await pool.query(
      `INSERT INTO services (
        name,
        price,
        price_type,
        price_per_km,
        active
      )
      VALUES ($1, $2, $3, $4, true)
      RETURNING *`,
      [
        cleanName,
        cleanPrice,
        cleanPriceType,
        finalPricePerKm
      ]
    );

    return res.status(201).json({
      message: "Servicio creado correctamente",
      service: result.rows[0]
    });
  } catch (error) {
    console.error("Error creando servicio:", error);

    return res.status(500).json({
      message: "Error creando servicio",
      error: error.message
    });
  }
}

export async function updateService(req, res) {
  try {
    const { id } = req.params;

    const existingServiceResult = await pool.query(
      `SELECT *
       FROM services
       WHERE id = $1`,
      [id]
    );

    if (existingServiceResult.rows.length === 0) {
      return res.status(404).json({
        message: "Servicio no encontrado"
      });
    }

    const existingService = existingServiceResult.rows[0];

    const nextName =
      req.body.name !== undefined
        ? String(req.body.name).trim()
        : existingService.name;

    const nextPrice =
      req.body.price !== undefined
        ? normalizeNumber(req.body.price)
        : Number(existingService.price);

    const nextPriceType =
      req.body.price_type !== undefined
        ? normalizePriceType(req.body.price_type)
        : normalizePriceType(existingService.price_type);

    const nextPricePerKm =
      req.body.price_per_km !== undefined
        ? normalizeNumber(req.body.price_per_km)
        : Number(existingService.price_per_km || 0);

    const nextActive =
      req.body.active !== undefined
        ? Boolean(req.body.active)
        : existingService.active;

    if (!nextName) {
      return res.status(400).json({
        message: "El nombre del servicio es obligatorio"
      });
    }

    if (!nextPriceType) {
      return res.status(400).json({
        message: "El tipo de tarifa debe ser fixed o distance"
      });
    }

    if (nextPrice === null || nextPrice < 0) {
      return res.status(400).json({
        message: "El precio debe ser un número válido"
      });
    }

    if (
      nextPriceType === "distance" &&
      (nextPricePerKm === null || nextPricePerKm <= 0)
    ) {
      return res.status(400).json({
        message:
          "Los servicios por distancia necesitan un precio por kilómetro mayor que cero"
      });
    }

    const finalPricePerKm =
      nextPriceType === "distance"
        ? nextPricePerKm
        : 0;

    const result = await pool.query(
      `UPDATE services
       SET
         name = $1,
         price = $2,
         price_type = $3,
         price_per_km = $4,
         active = $5
       WHERE id = $6
       RETURNING *`,
      [
        nextName,
        nextPrice,
        nextPriceType,
        finalPricePerKm,
        nextActive,
        id
      ]
    );

    return res.json({
      message: "Servicio actualizado correctamente",
      service: result.rows[0]
    });
  } catch (error) {
    console.error("Error actualizando servicio:", error);

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
    console.error("Error cambiando estado del servicio:", error);

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
    console.error("Error eliminando servicio:", error);

    return res.status(500).json({
      message: "Error eliminando servicio",
      error: error.message
    });
  }
}