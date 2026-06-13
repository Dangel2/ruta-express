import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/health", healthRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en puerto ${PORT}`
  );
});
