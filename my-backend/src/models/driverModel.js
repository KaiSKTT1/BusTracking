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
    // ✅ Gửi thông báo (ví dụ: tài xế gửi cho phụ huynh hoặc admin)
    sendNotification: async ({
        sender_id,
        receiver_id = null,
        student_id = null,
        bus_id = null,
        message,
        type = "general",
    }) => {
        // Nếu là loại picked_up, kiểm tra có tồn tại trong ngày chưa
        if (type === "picked_up" && student_id && sender_id) {
            const [exist] = await pool.execute(
                `SELECT notification_id FROM notifications 
             WHERE sender_id = ? AND student_id = ? AND type = 'picked_up'
             AND DATE(created_at) = CURDATE()`,
                [sender_id, student_id]
            );

            if (exist.length > 0) {
                console.log("⚠️ Học sinh đã được đón hôm nay, không thêm thông báo trùng.");
                return null; // Không chèn thêm
            }
        }

        // Nếu là loại not_picked_up, cũng kiểm tra tương tự (nếu cần)
        if (type === "not_picked_up" && student_id && sender_id) {
            const [exist] = await pool.execute(
                `SELECT notification_id FROM notifications 
             WHERE sender_id = ? AND student_id = ? AND type = 'not_picked_up'
             AND DATE(created_at) = CURDATE()`,
                [sender_id, student_id]
            );

            if (exist.length > 0) {
                console.log("⚠️ Đã có thông báo không đón được học sinh này hôm nay.");
                return null;
            }
        }

        // Nếu chưa có, thêm mới
        const [result] = await pool.execute(
            `INSERT INTO notifications 
            (sender_id, receiver_id, student_id, bus_id, message, type, status)
         VALUES (?, ?, ?, ?, ?, ?, 'unread')`,
            [sender_id, receiver_id, student_id, bus_id, message, type]
        );

        return result.insertId;
    },

};

export default DriverModel;
