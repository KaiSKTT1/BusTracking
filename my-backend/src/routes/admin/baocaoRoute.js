import express from "express";
import pool from "../../configs/connectDB.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM baocao");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { admin_id, driver_id, date } = req.body;
  try {
    await pool.execute(
      "INSERT INTO baocao (admin_id, driver_id, date) VALUES (?, ?, ?)",
      [admin_id, driver_id, date]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;