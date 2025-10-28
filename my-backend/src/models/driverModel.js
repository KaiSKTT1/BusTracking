import pool from "../configs/connectDB.js";

const DriverModel = {
    // ✅ Lấy tất cả tài xế
    getAll: async () => {
        const [rows] = await pool.execute(
            `SELECT 
                user_id, 
                username, 
                email, 
                role_id, 
                status 
             FROM user_account 
             WHERE role_id = 2` // 2 = Driver
        );
        return rows;
    },

    // ✅ Lấy tài xế theo ID
    getById: async (id) => {
        const [rows] = await pool.execute(
            `SELECT 
            user_id, 
            username, 
            email, 
            role_id, 
            status 
         FROM user_account 
         WHERE user_id = ?`,
            [id]
        );
        return rows[0];
    },


    // ✅ Kiểm tra email có tồn tại (để tránh trùng)
    findByEmail: async (email, excludeId = null) => {
        if (excludeId) {
            const [rows] = await pool.execute(
                `SELECT user_id 
                 FROM user_account 
                 WHERE email = ? AND user_id != ? AND role_id = 2`,
                [email, excludeId]
            );
            return rows;
        } else {
            const [rows] = await pool.execute(
                `SELECT user_id 
                 FROM user_account 
                 WHERE email = ? AND role_id = 2`,
                [email]
            );
            return rows;
        }
    },

    // ✅ Tạo tài xế mới
    create: async (username, email, password) => {
        const [result] = await pool.execute(
            `INSERT INTO user_account (username, email, password, role_id, status)
             VALUES (?, ?, ?, 2, 'active')`,
            [username, email, password]
        );
        return result.insertId;
    },

    // ✅ Cập nhật tài xế
    update: async (id, username, email, password = null, status = "active") => {
        if (password) {
            await pool.execute(
                `UPDATE user_account 
                 SET username = ?, email = ?, password = ?, status = ? 
                 WHERE user_id = ? AND role_id = 2`,
                [username, email, password, status, id]
            );
        } else {
            await pool.execute(
                `UPDATE user_account 
                 SET username = ?, email = ?, status = ? 
                 WHERE user_id = ? AND role_id = 2`,
                [username, email, status, id]
            );
        }
    },

    // ✅ Kiểm tra tài xế có tồn tại
    exists: async (id) => {
        const [rows] = await pool.execute(
            `SELECT user_id 
             FROM user_account 
             WHERE user_id = ? AND role_id = 2`,
            [id]
        );
        return rows.length > 0;
    },

    // ✅ Kiểm tra tài xế có xe không
    hasBuses: async (id) => {
        const [rows] = await pool.execute(
            `SELECT bus_id 
             FROM bus 
             WHERE driver_id = ?`,
            [id]
        );
        return rows.length > 0;
    },

    // ✅ Xóa tài xế
    delete: async (id) => {
        await pool.execute(
            `DELETE FROM user_account 
             WHERE user_id = ? AND role_id = 2`,
            [id]
        );
    },
};

export default DriverModel;
