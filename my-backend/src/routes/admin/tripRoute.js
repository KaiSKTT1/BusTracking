import express from "express";
import pool from "../../configs/connectDB.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM trip");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { route_id, time_arrival_first, time_arrival_end } = req.body;
  try {
    await pool.execute(
      "INSERT INTO trip (route_id, time_arrival_first, time_arrival_end) VALUES (?, ?, ?)",
      [route_id, time_arrival_first, time_arrival_end]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;