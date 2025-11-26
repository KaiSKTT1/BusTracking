import pool from '../configs/connectDB.js';

let getAllUsers = async (req, res) => {
    console.log('Fetching all users...');
    try {
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
        console.error('Error in getAllUsers:', err);
        return res.status(500).json({ message: err.message });
    }
};
let getUserById = async (req, res) => {
    const { id } = req.params;
    console.log(`Fetching user with id: ${id}`);

    try {
        const query = `
            SELECT 
                ua.user_id AS id,
                ua.username AS name,
                ua.email,
                ua.status,
                r.name_role AS role
            FROM user_account ua
            LEFT JOIN role r ON ua.role_id = r.role_id
            WHERE ua.user_id = ?
        `;

        const [rows] = await pool.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "ok",
            data: rows[0]
        });
    } catch (err) {
        console.error("Error in getUserById:", err);
        return res.status(500).json({ message: err.message });
    }
};


let createNewUser = async (req, res) => {
    console.log('Creating new user with body:', req.body);
    let { username, email, password, role_id } = req.body;

    if (!username || !email || !password || !role_id) {
        return res.status(400).json({
            message: 'missing required params (username, email, password, role_id)'
        });
    }

    try {
        await pool.execute(
            `INSERT INTO user_account (username, email, password, role_id, status) 
             VALUES (?, ?, ?, ?, 'active')`,
            [username, email, password, role_id]
        );

        return res.status(201).json({ message: 'user created' });
    } catch (err) {
        console.error('Error in createNewUser:', err);
        return res.status(500).json({ message: err.message });
    }
};

let updateUser = async (req, res) => {
    let { id } = req.params;
    let { username, email, password, role_id, status } = req.body;
    console.log(`Updating user ${id} with body:`, req.body);

    if (!id || !username || !email || !role_id || !status) {
        return res.status(400).json({
            message: 'missing required params (id, username, email, role_id, status)'
        });
    }

    try {
        // Sửa: Lấy kết quả [result]
        const [result] = await pool.execute(
            `UPDATE user_account 
             SET username = ?, email = ?, password = ?, role_id = ?, status = ?
             WHERE user_id = ?`,
            [username, email, password || null, role_id, status, id]
        );

        // Sửa: Kiểm tra affectedRows
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or data unchanged' });
        }

        return res.status(200).json({ message: 'user updated' });
    } catch (err) {
        console.error(`Error in updateUser (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

let deleteUser = async (req, res) => {
    let userId = req.params.id;
    console.log(`Deleting user with id: ${userId}`);

    if (!userId) {
        return res.status(400).json({
            message: 'missing required params'
        });
    }

    try {
        // Sửa: Lấy kết quả [result]
        const [result] = await pool.execute('DELETE FROM user_account WHERE user_id = ?', [userId]);

        // Sửa: Kiểm tra affectedRows
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'user deleted' });
    } catch (err) {
        console.error(`Error in deleteUser (id: ${userId}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

export default {
    getAllUsers,
    getUserById,
    createNewUser,
    updateUser,
    deleteUser
};