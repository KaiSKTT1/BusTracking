import pool from '../configs/connectDB.js';

let getAllDrivers = async (req, res) => {
    console.log('Fetching all drivers...');
    try {
        const [rows] = await pool.execute(
            `SELECT 
                ua.user_id as id, 
                ua.username as name, 
                ua.email, 
                r.name_role as role,
                ua.status
             FROM user_account ua
             JOIN role r ON ua.role_id = r.role_id
             WHERE r.name_role = 'Driver'`
        );
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        console.error('Error in getAllDrivers:', err);
        return res.status(500).json({ message: err.message });
    }
};

let getDriverById = async (req, res) => {
    const { id } = req.params;
    console.log(`Fetching driver with id: ${id}`);
    try {
        const [rows] = await pool.execute(
            `SELECT 
                ua.user_id as id, 
                ua.username as name, 
                ua.email, 
                r.name_role as role,
                ua.status
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
        console.error(`Error in getDriverById (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

let createDriver = async (req, res) => {
    console.log('Creating new driver with body:', req.body);
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
        
        const [result] = await pool.execute(
            'INSERT INTO user_account (username, email, password, role_id, status) VALUES (?, ?, ?, 2, "active")',
            [username, email, password]
        );

        return res.status(201).json({
            message: 'Driver created successfully',
            data: { id: result.insertId }
        });
    } catch (err) {
        console.error('Error in createDriver:', err);
        return res.status(500).json({ message: err.message });
    }
};

// UPDATE driver
let updateDriver = async (req, res) => {
    const { id } = req.params;
    // SỬA 1: Thêm 'status' vào đây
    const { username, email, password, status } = req.body;
    console.log(`Updating driver ${id} with body:`, req.body);

    // SỬA 2: Thêm 'status' vào validation
    if (!username || !email || !status) {
        return res.status(400).json({
            message: 'Missing required fields: username, email, status'
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

        // SỬA 3: Cập nhật các câu query để bao gồm 'status'
        let result;
        if (password) {
            [result] = await pool.execute(
                'UPDATE user_account SET username = ?, email = ?, password = ?, status = ? WHERE user_id = ?',
                [username, email, password, status, id]
            );
        } else {
            [result] = await pool.execute(
                'UPDATE user_account SET username = ?, email = ?, status = ? WHERE user_id = ?',
                [username, email, status, id]
            );
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Driver not found or data unchanged' });
        }

        return res.status(200).json({ message: 'Driver updated successfully' });
    } catch (err) {
        console.error(`Error in updateDriver (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

let deleteDriver = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting driver with id: ${id}`);

    try {
        const [driver] = await pool.execute(
            "SELECT ua.user_id FROM user_account ua JOIN role r ON ua.role_id = r.role_id WHERE ua.user_id = ? AND r.name_role = 'Driver'",
            [id]
        );

        if (driver.length === 0) {
            return res.status(404).json({ message: 'Driver not found' });
        }

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

        // Sửa: Lấy kết quả [result]
        const [result] = await pool.execute('DELETE FROM user_account WHERE user_id = ?', [id]);

        // Sửa: Kiểm tra affectedRows
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        return res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (err) {
        console.error(`Error in deleteDriver (id: ${id}):`, err);
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