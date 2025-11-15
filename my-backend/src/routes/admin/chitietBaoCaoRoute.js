import express from "express";
import pool from "../../configs/connectDB.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM chitietbaocao");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { bao_cao_id, student_id, tinh_trang } = req.body;
  try {
    await pool.execute(
      "INSERT INTO chitietbaocao (bao_cao_id, student_id, tinh_trang) VALUES (?, ?, ?)",
      [bao_cao_id, student_id, tinh_trang]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;