import pool from '../configs/connectDB.js';

// GET all buses
let getAllBuses = async (req, res) => {
    try {
        // Sửa: Đổi tên cột. Bỏ JOIN tài xế vì 'driver_id' không còn trong bảng 'bus'
        const [rows] = await pool.execute(`
            SELECT 
                bus_id as id, 
                license, 
                capacity as seats
            FROM bus
        `);
        // Lưu ý: Thông tin tài xế không còn ở đây theo schema mới
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET bus by ID
let getBusById = async (req, res) => {
    const { id } = req.params;
    try {
        // Sửa: Đổi tên cột, bỏ JOIN
        const [rows] = await pool.execute(`
            SELECT 
                bus_id as id, 
                license, 
                capacity as seats
            FROM bus
            WHERE bus_id = ?
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
    // Sửa: Đổi tên cột, bỏ 'driver_id'
    const { license, capacity } = req.body;

    if (!license || !capacity) {
        return res.status(400).json({
            message: 'Missing required fields: license, capacity'
        });
    }

    try {
        const [existing] = await pool.execute(
            'SELECT bus_id FROM bus WHERE license = ?',
            [license]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: 'License plate already exists'
            });
        }
        
        // Sửa: INSERT không có driver_id
        const [result] = await pool.execute(
            'INSERT INTO bus (license, capacity) VALUES (?, ?)',
            [license, capacity]
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
    // Sửa: Đổi tên cột, bỏ 'driver_id'
    const { license, capacity } = req.body;

    if (!license || !capacity) {
        return res.status(400).json({
            message: 'Missing required fields: license, capacity'
        });
    }

    try {
        const [bus] = await pool.execute(
            'SELECT bus_id FROM bus WHERE bus_id = ?',
            [id]
        );

        if (bus.length === 0) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        const [existing] = await pool.execute(
            'SELECT bus_id FROM bus WHERE license = ? AND bus_id != ?',
            [license, id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: 'License plate already exists'
            });
        }

        // Sửa: UPDATE không có driver_id
        await pool.execute(
            'UPDATE bus SET license = ?, capacity = ? WHERE bus_id = ?',
            [license, capacity, id]
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
        const [bus] = await pool.execute(
            'SELECT bus_id FROM bus WHERE bus_id = ?',
            [id]
        );

        if (bus.length === 0) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        // Sửa: Kiểm tra bảng 'timetable' (thay vì 'schedules')
        const [schedules] = await pool.execute(
            'SELECT timetable_id FROM timetable WHERE bus_id = ?',
            [id]
        );

        if (schedules.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete bus with assigned schedules'
            });
        }

        await pool.execute('DELETE FROM bus WHERE bus_id = ?', [id]);

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