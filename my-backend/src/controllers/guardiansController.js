import pool from '../configs/connectDB.js';

// GET all guardians (role = 'Parent')
let getAllGuardians = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT id, name, phone, email, role, created_at FROM users WHERE role = 'Parent'"
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
        const [rows] = await pool.execute(
            "SELECT id, name, phone, email, role, created_at FROM users WHERE id = ? AND role = 'Parent'",
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
    const { name, phone, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({
            message: 'Missing required fields: name, email, password'
        });
    }

    try {
        // Check if email already exists
        const [existing] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }

        // Insert new guardian with role = 'Parent'
        const [result] = await pool.execute(
            'INSERT INTO users (name, phone, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [name, phone || null, email, password, 'Parent']
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
    const { name, phone, email, password } = req.body;

    // Validation
    if (!name || !email) {
        return res.status(400).json({
            message: 'Missing required fields: name, email'
        });
    }

    try {
        // Check if guardian exists and role is Parent
        const [guardian] = await pool.execute(
            "SELECT id FROM users WHERE id = ? AND role = 'Parent'",
            [id]
        );

        if (guardian.length === 0) {
            return res.status(404).json({ message: 'Guardian not found' });
        }

        // Check if new email already exists (excluding current guardian)
        const [existing] = await pool.execute(
            'SELECT id FROM users WHERE email = ? AND id != ?',
            [email, id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }

        // Update query - only update password if provided
        if (password) {
            await pool.execute(
                'UPDATE users SET name = ?, phone = ?, email = ?, password = ? WHERE id = ?',
                [name, phone || null, email, password, id]
            );
        } else {
            await pool.execute(
                'UPDATE users SET name = ?, phone = ?, email = ? WHERE id = ?',
                [name, phone || null, email, id]
            );
        }

        return res.status(200).json({
            message: 'Guardian updated successfully'
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// DELETE guardian
let deleteGuardian = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if guardian exists and role is Parent
        const [guardian] = await pool.execute(
            "SELECT id FROM users WHERE id = ? AND role = 'Parent'",
            [id]
        );

        if (guardian.length === 0) {
            return res.status(404).json({ message: 'Guardian not found' });
        }

        // Check if guardian has students (prevent deletion)
        const [students] = await pool.execute(
            'SELECT id FROM students WHERE parent_id = ?',
            [id]
        );

        if (students.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete guardian with assigned students'
            });
        }

        // Delete guardian
        await pool.execute('DELETE FROM users WHERE id = ?', [id]);

        return res.status(200).json({
            message: 'Guardian deleted successfully'
        });
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
