import pool from '../configs/connectDB.js';

// GET all drivers (role = 'Driver')
let getAllDrivers = async (req, res) => {
    try {
        // Sửa: JOIN user_account với role, đổi tên cột
        const [rows] = await pool.execute(
            `SELECT 
                ua.user_id as id, 
                ua.username as name, 
                ua.email, 
                r.name_role as role
             FROM user_account ua
             JOIN role r ON ua.role_id = r.role_id
             WHERE r.name_role = 'Driver'`
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
        // Sửa: JOIN và dùng user_id
        const [rows] = await pool.execute(
            `SELECT 
                ua.user_id as id, 
                ua.username as name, 
                ua.email, 
                r.name_role as role
             FROM user_account ua
             JOIN role r ON ua.role_id = r.role_id
             WHERE ua.user_id = ? AND r.name_role = 'Driver'`,
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
        
        // Sửa: INSERT vào user_account, role_id = 2 (là Driver)
        const [result] = await pool.execute(
            'INSERT INTO user_account (username, email, password, role_id, status) VALUES (?, ?, ?, 2, "active")',
            [username, email, password]
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
    // Sửa: dùng 'username', bỏ 'phone'
    const { username, email, password } = req.body;

    if (!username || !email) {
        return res.status(400).json({
            message: 'Missing required fields: username, email'
        });
    }

    try {
        const [driver] = await pool.execute(
            "SELECT ua.user_id FROM user_account ua JOIN role r ON ua.role_id = r.role_id WHERE ua.user_id = ? AND r.name_role = 'Driver'",
            [id]
        );

        if (driver.length === 0) {
            return res.status(404).json({ message: 'Driver not found' });
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

        return res.status(200).json({ message: 'Driver updated successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// DELETE driver
let deleteDriver = async (req, res) => {
    const { id } = req.params;

    try {
        const [driver] = await pool.execute(
            "SELECT ua.user_id FROM user_account ua JOIN role r ON ua.role_id = r.role_id WHERE ua.user_id = ? AND r.name_role = 'Driver'",
            [id]
        );

        if (driver.length === 0) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Sửa: Kiểm tra bảng 'timetable' và 'trip' thay vì 'bus'
        const [timetables] = await pool.execute(
            'SELECT timetable_id FROM timetable WHERE driver_id = ?', [id]
        );
        if (timetables.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete driver with assigned timetables'
            });
        }
        
        const [trips] = await pool.execute(
            'SELECT trip_id FROM trip WHERE driver_id = ?', [id]
        );
        if (trips.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete driver with assigned trips'
            });
        }

        // Sửa: Xoá khỏi user_account
        await pool.execute('DELETE FROM user_account WHERE user_id = ?', [id]);

        return res.status(200).json({ message: 'Driver deleted successfully' });
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