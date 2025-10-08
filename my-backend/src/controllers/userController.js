import pool from '../configs/connectDB.js';
let getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Users');
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

let createNewUser = async (req, res) => {
    let { name, phone, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({
            message: 'missing required params'
        });
    }

    try {
        await pool.execute(
            `INSERT INTO Users (name, phone, email, password, role) 
             VALUES (?, ?, ?, ?, ?)`,
            [name, phone || null, email, password, role]
        );

        return res.status(201).json({ message: 'user created' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

};
let updateUser = async (req, res) => {
    let { id } = req.params;
    let { name, phone, email, password, role } = req.body;

    if (!id || !name || !email || !role) {
        return res.status(400).json({
            message: 'missing required params'
        });
    }

    try {
        await pool.execute(
            `UPDATE Users 
             SET name = ?, phone = ?, email = ?, password = ?, role = ? 
             WHERE id = ?`,
            [name, phone || null, email, password || null, role, id]
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
        await pool.execute('DELETE FROM Users WHERE id = ?', [userId]);
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