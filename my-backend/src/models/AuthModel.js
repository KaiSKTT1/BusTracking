import pool from "../configs/connectDB.js";

// 🧠 Lấy user theo username (kèm role)
let getUserByName = async (username) => {
    const [rows] = await pool.query(
        `SELECT 
        user_account.user_id, 
        user_account.username, 
        user_account.password, 
        user_account.email, 
        user_account.status, 
        user_account.role_id,       
        role.name_role
     FROM user_account
     LEFT JOIN role ON user_account.role_id = role.role_id
     WHERE user_account.username = ?`,
        [username]
    );
    return rows[0];
};


// 🧠 Lấy user theo email (kèm role)
let getUserByEmail = async (email) => {
    const [rows] = await pool.query(
        `SELECT 
        user_account.user_id, 
        user_account.username, 
        user_account.password, 
        user_account.email, 
        user_account.status, 
        user_account.role_id,      
        role.name_role
     FROM user_account
     LEFT JOIN role ON user_account.role_id = role.role_id
     WHERE user_account.email = ?`,
        [email]
    );
    return rows[0];
};


// 🧠 Lưu refresh token
let saveRefreshToken = async (userId, token, expiresAt) => {
    await pool.query(
        "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
        [userId, token, expiresAt]
    );
};

// 🧠 Tìm refresh token hợp lệ
let findValidRefreshToken = async (userId, tokenHash) => {
    const [rows] = await pool.query(
        "SELECT * FROM refresh_tokens WHERE user_id = ? AND token_hash = ? AND expires_at > NOW()",
        [userId, tokenHash]
    );
    return rows[0];
};

// 🧠 Xóa refresh token khi logout
let deleteRefreshToken = async (tokenHash) => {
    await pool.query("DELETE FROM refresh_tokens WHERE token_hash = ?", [tokenHash]);
};

export default {
    getUserByName,
    getUserByEmail, // ✅ thêm hàm mới
    saveRefreshToken,
    findValidRefreshToken,
    deleteRefreshToken,
};
