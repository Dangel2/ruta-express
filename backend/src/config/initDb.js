
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { pool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initDatabase() {
  try {

    const schemaPath = path.join(
      __dirname,
      "../../database/schema.sql"
    );

    const schema = fs.readFileSync(
      schemaPath,
      "utf8"
    );

    await pool.query(schema);

    console.log("✅ Tablas verificadas correctamente");

  } catch (error) {

    console.error(
      "❌ Error creando tablas:",
      error.message
    );

  }
}