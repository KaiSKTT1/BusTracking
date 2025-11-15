import pool from '../configs/connectDB.js';

let getAllUsers = async (req, res) => {
    try {
        // Sửa: JOIN user_account với role, đổi tên cột
        const query = `
            SELECT 
                ua.user_id as id, 
                ua.username as name, 
                ua.email, 
                ua.status,
                r.name_role as role
            FROM user_account ua
            LEFT JOIN role r ON ua.role_id = r.role_id
        `;
        const [rows] = await pool.execute(query);
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

let createNewUser = async (req, res) => {
    // Sửa: đổi 'name' thành 'username', 'role' thành 'role_id'. Bỏ 'phone'
    let { username, email, password, role_id } = req.body;

    if (!username || !email || !password || !role_id) {
        return res.status(400).json({
            message: 'missing required params (username, email, password, role_id)'
        });
    }

    try {
        // Sửa: INSERT vào user_account
        await pool.execute(
            `INSERT INTO user_account (username, email, password, role_id, status) 
             VALUES (?, ?, ?, ?, 'active')`, // Giả sử status mặc định là 'active'
            [username, email, password, role_id]
        );

        return res.status(201).json({ message: 'user created' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

let updateUser = async (req, res) => {
    let { id } = req.params;
    // Sửa: đổi 'name' thành 'username', 'role' thành 'role_id'. Bỏ 'phone'
    let { username, email, password, role_id, status } = req.body;

    if (!id || !username || !email || !role_id || !status) {
        return res.status(400).json({
            message: 'missing required params (id, username, email, role_id, status)'
        });
    }

    try {
        // Sửa: UPDATE user_account
        await pool.execute(
            `UPDATE user_account 
             SET username = ?, email = ?, password = ?, role_id = ?, status = ?
             WHERE user_id = ?`,
            [username, email, password || null, role_id, status, id]
        );

        return res.status(200).json({ message: 'user updated' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

let deleteUser = async (req, res) => {
    let userId = req.params.id;

    if (!userId) {
        return res.status(400).json({
            message: 'missing required params'
        });
    }

    try {
        // Sửa: DELETE từ user_account bằng user_id
        await pool.execute('DELETE FROM user_account WHERE user_id = ?', [userId]);
        return res.status(200).json({ message: 'user deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export default {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
};