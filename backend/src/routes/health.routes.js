import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    app: "Ruta Express API"
  });
});

export default router;