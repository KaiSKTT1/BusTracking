import pool from "../configs/connectDB.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Kiểm tra username có tồn tại không
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length > 0) {
      return res.json({ success: true, message: "Đăng nhập thành công!" });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Sai tài khoản hoặc mật khẩu!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
