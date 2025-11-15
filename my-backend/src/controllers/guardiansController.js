import pool from '../configs/connectDB.js';

// GET all guardians (role = 'Parent')
let getAllGuardians = async (req, res) => {
    try {
        // Sửa: JOIN user_account với role
        const [rows] = await pool.execute(
            `SELECT 
                ua.user_id as id, 
                ua.username as name, 
                ua.email, 
                r.name_role as role
             FROM user_account ua
             JOIN role r ON ua.role_id = r.role_id
             WHERE r.name_role = 'Parent'`
        );
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET guardian by ID
let getGuardianById = async (req, res) => {
    const { id } = req.params;
    try {
        // Sửa: JOIN và dùng user_id
        const [rows] = await pool.execute(
            `SELECT 
                ua.user_id as id, 
                ua.username as name, 
                ua.email, 
                r.name_role as role
             FROM user_account ua
             JOIN role r ON ua.role_id = r.role_id
             WHERE ua.user_id = ? AND r.name_role = 'Parent'`,
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Guardian not found' });
        }
        return res.status(200).json({ message: 'ok', data: rows[0] });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// CREATE new guardian
let createGuardian = async (req, res) => {
    // Sửa: dùng 'username', bỏ 'phone'
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'Missing required fields: username, email, password'
        });
    }

    try {
        const [existing] = await pool.execute(
            'SELECT user_id FROM user_account WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Sửa: INSERT vào user_account, role_id = 3 (là Parent)
        const [result] = await pool.execute(
            'INSERT INTO user_account (username, email, password, role_id, status) VALUES (?, ?, ?, 3, "active")',
            [username, email, password]
        );

        return res.status(201).json({
            message: 'Guardian created successfully',
            data: { id: result.insertId }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// UPDATE guardian
let updateGuardian = async (req, res) => {
    const { id } = req.params;
    // Sửa: dùng 'username', bỏ 'phone'
    const { username, email, password } = req.body;

    if (!username || !email) {
        return res.status(400).json({
            message: 'Missing required fields: username, email'
        });
    }

    try {
        const [guardian] = await pool.execute(
            "SELECT ua.user_id FROM user_account ua JOIN role r ON ua.role_id = r.role_id WHERE ua.user_id = ? AND r.name_role = 'Parent'",
            [id]
        );

        if (guardian.length === 0) {
            return res.status(404).json({ message: 'Guardian not found' });
        }

        const [existing] = await pool.execute(
            'SELECT user_id FROM user_account WHERE email = ? AND user_id != ?',
            [email, id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Sửa: Cập nhật user_account
        if (password) {
            await pool.execute(
                'UPDATE user_account SET username = ?, email = ?, password = ? WHERE user_id = ?',
                [username, email, password, id]
            );
        } else {
            await pool.execute(
                'UPDATE user_account SET username = ?, email = ? WHERE user_id = ?',
                [username, email, id]
            );
        }

        return res.status(200).json({ message: 'Guardian updated successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// DELETE guardian
let deleteGuardian = async (req, res) => {
    const { id } = req.params;

    try {
        const [guardian] = await pool.execute(
            "SELECT ua.user_id FROM user_account ua JOIN role r ON ua.role_id = r.role_id WHERE ua.user_id = ? AND r.name_role = 'Parent'",
            [id]
        );

        if (guardian.length === 0) {
            return res.status(404).json({ message: 'Guardian not found' });
        }

        // Sửa: Kiểm tra bảng 'student' và cột 'id_ph'
        const [students] = await pool.execute(
            'SELECT student_id FROM student WHERE id_ph = ?',
            [id]
        );

        if (students.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete guardian with assigned students'
            });
        }

        // Sửa: Xoá khỏi user_account
        await pool.execute('DELETE FROM user_account WHERE user_id = ?', [id]);

        return res.status(200).json({ message: 'Guardian deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export default {
    getAllGuardians,
    getGuardianById,
    createGuardian,
    updateGuardian,
    deleteGuardian
};