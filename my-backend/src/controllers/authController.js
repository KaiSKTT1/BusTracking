import pool from '../configs/connectDB.js';

// Xử lý login
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    if (!email || !password) {
        return res.status(400).json({ message: "Email và password bắt buộc" });
    }

    try {
        // Sửa: Thêm JOIN với bảng role để lấy name_role
        const [rows] = await pool.execute(
            `SELECT 
                ua.user_id, 
                ua.username, 
                ua.email, 
                ua.status,
                r.name_role as role 
             FROM user_account ua
             JOIN role r ON ua.role_id = r.role_id
             WHERE ua.email = ? AND ua.password = ? 
             LIMIT 1`,
            [email, password]
        );

        if (!rows || rows.length === 0) {
            console.log(`Login failed for: ${email}`);
            return res.status(401).json({ message: "Email hoặc password sai" });
        }

        const user = rows[0];

        if (user.status !== 'active') {
             console.log(`Login failed: User ${email} is not active`);
             return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa" });
        }

        console.log(`Login successful for: ${user.username}`);
        // Tạm thời tạo token giả, sau này bạn nên dùng JWT
        const token = "jwt_token_example_" + user.user_id; 

        return res.json({
            message: "Login successful",
            token: token,
            user: user // Gửi thông tin user (đã bao gồm 'role')
        });

    } catch (err) {
        console.error("Auth error:", err);
        return res.status(500).json({ error: err.message });
    }
};

export default {
    login
};