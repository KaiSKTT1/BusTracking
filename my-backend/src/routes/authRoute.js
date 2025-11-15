import express from "express";
import pool from "../configs/connectDB.js";

const router = express.Router();

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email và password bắt buộc" });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT user_id, username, email, role_id, status FROM user_account WHERE email = ? AND password = ? LIMIT 1",
      [email, password]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: "Email hoặc password sai" });
    }

    const user = rows[0];
    return res.json({
      token: "token-" + user.user_id,
      user
    });
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;