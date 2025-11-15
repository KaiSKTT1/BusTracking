import express from "express";
import pool from "../../configs/connectDB.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM timetable");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { bus_id, trip_id, driver_id, planned_date } = req.body;
  try {
    await pool.execute(
      "INSERT INTO timetable (bus_id, trip_id, driver_id, planned_date) VALUES (?, ?, ?, ?)",
      [bus_id, trip_id, driver_id, planned_date]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;