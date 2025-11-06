import pool from '../configs/connectDB.js';

// GET all drivers (role = 'Driver')
let getAllDrivers = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT id, name, phone, email, role, created_at FROM users WHERE role = 'Driver'"
        );
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET driver by ID
let getDriverById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute(
            "SELECT id, name, phone, email, role, created_at FROM users WHERE id = ? AND role = 'Driver'",
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        return res.status(200).json({ message: 'ok', data: rows[0] });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// CREATE new driver
let createDriver = async (req, res) => {
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

        // Insert new driver with role = 'Driver'
        const [result] = await pool.execute(
            'INSERT INTO users (name, phone, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [name, phone || null, email, password, 'Driver']
        );

        return res.status(201).json({
            message: 'Driver created successfully',
            data: { id: result.insertId }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// UPDATE driver
let updateDriver = async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, password } = req.body;

    // Validation
    if (!name || !email) {
        return res.status(400).json({
            message: 'Missing required fields: name, email'
        });
    }

    try {
        // Check if driver exists and role is Driver
        const [driver] = await pool.execute(
            "SELECT id FROM users WHERE id = ? AND role = 'Driver'",
            [id]
        );

        if (driver.length === 0) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Check if new email already exists (excluding current driver)
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
            message: 'Driver updated successfully'
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// DELETE driver
let deleteDriver = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if driver exists and role is Driver
        const [driver] = await pool.execute(
            "SELECT id FROM users WHERE id = ? AND role = 'Driver'",
            [id]
        );

        if (driver.length === 0) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Check if driver has assigned buses (prevent deletion)
        const [buses] = await pool.execute(
            'SELECT id FROM bus WHERE driver_id = ?',
            [id]
        );

        if (buses.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete driver with assigned buses'
            });
        }

        // Delete driver
        await pool.execute('DELETE FROM users WHERE id = ?', [id]);

        return res.status(200).json({
            message: 'Driver deleted successfully'
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export default {
    getAllDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver
};
