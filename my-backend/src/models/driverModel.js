import pool from "../configs/connectDB.js";

const DriverModel = {
    // Lấy tất cả tài xế
    getAll: async () => {
        const [rows] = await pool.execute(
            "SELECT id, name, phone, email, role, created_at FROM users WHERE role = 'Driver'"
        );
        return rows;
    },

    // Lấy tài xế theo ID
    getById: async (id) => {
        const [rows] = await pool.execute(
            "SELECT id, name, phone, email, role, created_at FROM users WHERE id = ? AND role = 'Driver'",
            [id]
        );
        return rows[0];
    },

    // Kiểm tra email có tồn tại không
    findByEmail: async (email, excludeId = null) => {
        if (excludeId) {
            const [rows] = await pool.execute(
                "SELECT id FROM users WHERE email = ? AND id != ?",
                [email, excludeId]
            );
            return rows;
        } else {
            const [rows] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
            return rows;
        }
    },

    // Tạo tài xế mới
    create: async (name, phone, email, password) => {
        const [result] = await pool.execute(
            "INSERT INTO users (name, phone, email, password, role) VALUES (?, ?, ?, ?, 'Driver')",
            [name, phone || null, email, password]
        );
        return result.insertId;
    },

    // Cập nhật tài xế
    update: async (id, name, phone, email, password = null) => {
        if (password) {
            await pool.execute(
                "UPDATE users SET name = ?, phone = ?, email = ?, password = ? WHERE id = ?",
                [name, phone || null, email, password, id]
            );
        } else {
            await pool.execute(
                "UPDATE users SET name = ?, phone = ?, email = ? WHERE id = ?",
                [name, phone || null, email, id]
            );
        }
    },

    // Kiểm tra tài xế tồn tại
    exists: async (id) => {
        const [rows] = await pool.execute(
            "SELECT id FROM users WHERE id = ? AND role = 'Driver'",
            [id]
        );
        return rows.length > 0;
    },

    // Kiểm tra tài xế có xe không
    hasBuses: async (id) => {
        const [rows] = await pool.execute("SELECT id FROM bus WHERE driver_id = ?", [id]);
        return rows.length > 0;
    },

    // Xóa tài xế
    delete: async (id) => {
        await pool.execute("DELETE FROM users WHERE id = ?", [id]);
    },
};

export default DriverModel;
