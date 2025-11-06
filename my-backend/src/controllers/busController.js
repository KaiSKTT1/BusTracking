import pool from '../configs/connectDB.js';

// GET all buses with driver information
let getAllBuses = async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                b.id, 
                b.license_plate, 
                b.seats, 
                b.driver_id,
                b.created_at,
                u.name as driver_name,
                u.email as driver_email,
                u.phone as driver_phone
            FROM bus b
            LEFT JOIN users u ON b.driver_id = u.id AND u.role = 'Driver'
        `);
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET bus by ID
let getBusById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute(`
            SELECT 
                b.id, 
                b.license_plate, 
                b.seats, 
                b.driver_id,
                b.created_at,
                u.name as driver_name,
                u.email as driver_email,
                u.phone as driver_phone
            FROM bus b
            LEFT JOIN users u ON b.driver_id = u.id AND u.role = 'Driver'
            WHERE b.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        return res.status(200).json({ message: 'ok', data: rows[0] });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// CREATE new bus
let createBus = async (req, res) => {
    const { license_plate, seats, driver_id } = req.body;

    // Validation
    if (!license_plate || !seats) {
        return res.status(400).json({
            message: 'Missing required fields: license_plate, seats'
        });
    }

    try {
        // Check if license plate already exists
        const [existing] = await pool.execute(
            'SELECT id FROM bus WHERE license_plate = ?',
            [license_plate]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: 'License plate already exists'
            });
        }

        // If driver_id is provided, check if it's a valid driver
        if (driver_id) {
            const [driver] = await pool.execute(
                "SELECT id FROM users WHERE id = ? AND role = 'Driver'",
                [driver_id]
            );

            if (driver.length === 0) {
                return res.status(400).json({
                    message: 'Invalid driver ID'
                });
            }
        }

        // Insert new bus
        const [result] = await pool.execute(
            'INSERT INTO bus (license_plate, seats, driver_id) VALUES (?, ?, ?)',
            [license_plate, seats, driver_id || null]
        );

        return res.status(201).json({
            message: 'Bus created successfully',
            data: { id: result.insertId }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// UPDATE bus
let updateBus = async (req, res) => {
    const { id } = req.params;
    const { license_plate, seats, driver_id } = req.body;

    // Validation
    if (!license_plate || !seats) {
        return res.status(400).json({
            message: 'Missing required fields: license_plate, seats'
        });
    }

    try {
        // Check if bus exists
        const [bus] = await pool.execute(
            'SELECT id FROM bus WHERE id = ?',
            [id]
        );

        if (bus.length === 0) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        // Check if new license plate already exists (excluding current bus)
        const [existing] = await pool.execute(
            'SELECT id FROM bus WHERE license_plate = ? AND id != ?',
            [license_plate, id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: 'License plate already exists'
            });
        }

        // If driver_id is provided, check if it's a valid driver
        if (driver_id) {
            const [driver] = await pool.execute(
                "SELECT id FROM users WHERE id = ? AND role = 'Driver'",
                [driver_id]
            );

            if (driver.length === 0) {
                return res.status(400).json({
                    message: 'Invalid driver ID'
                });
            }
        }

        // Update bus
        await pool.execute(
            'UPDATE bus SET license_plate = ?, seats = ?, driver_id = ? WHERE id = ?',
            [license_plate, seats, driver_id || null, id]
        );

        return res.status(200).json({
            message: 'Bus updated successfully'
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// DELETE bus
let deleteBus = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if bus exists
        const [bus] = await pool.execute(
            'SELECT id FROM bus WHERE id = ?',
            [id]
        );

        if (bus.length === 0) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        // Check if bus has schedules (prevent deletion)
        const [schedules] = await pool.execute(
            'SELECT id FROM schedules WHERE bus_id = ?',
            [id]
        );

        if (schedules.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete bus with assigned schedules'
            });
        }

        // Delete bus
        await pool.execute('DELETE FROM bus WHERE id = ?', [id]);

        return res.status(200).json({
            message: 'Bus deleted successfully'
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export default {
    getAllBuses,
    getBusById,
    createBus,
    updateBus,
    deleteBus
};
