import pool from '../configs/connectDB.js';

let getAllBuses = async (req, res) => {
    console.log('Fetching all buses...');
    try {
        const [rows] = await pool.execute(`
            SELECT 
                bus_id as id, 
                license, 
                capacity as seats
            FROM bus
        `);
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        console.error('Error in getAllBuses:', err);
        return res.status(500).json({ message: err.message });
    }
};

let getBusById = async (req, res) => {
    const { id } = req.params;
    console.log(`Fetching bus with id: ${id}`);
    try {
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
        console.error(`Error in getBusById (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

let createBus = async (req, res) => {
    const { license, capacity } = req.body;
    console.log('Creating new bus with body:', req.body);

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
        
        const [result] = await pool.execute(
            'INSERT INTO bus (license, capacity) VALUES (?, ?)',
            [license, capacity]
        );

        return res.status(201).json({
            message: 'Bus created successfully',
            data: { id: result.insertId }
        });
    } catch (err) {
        console.error('Error in createBus:', err);
        return res.status(500).json({ message: err.message });
    }
};

let updateBus = async (req, res) => {
    const { id } = req.params;
    const { license, capacity } = req.body;
    console.log(`Updating bus ${id} with body:`, req.body);

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

        // Sửa: Lấy kết quả [result]
        const [result] = await pool.execute(
            'UPDATE bus SET license = ?, capacity = ? WHERE bus_id = ?',
            [license, capacity, id]
        );

        // Sửa: Kiểm tra affectedRows
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bus not found or data unchanged' });
        }

        return res.status(200).json({
            message: 'Bus updated successfully'
        });
    } catch (err) {
        console.error(`Error in updateBus (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

let deleteBus = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting bus with id: ${id}`);

    try {
        const [bus] = await pool.execute(
            'SELECT bus_id FROM bus WHERE bus_id = ?',
            [id]
        );

        if (bus.length === 0) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        const [schedules] = await pool.execute(
            'SELECT timetable_id FROM timetable WHERE bus_id = ?',
            [id]
        );

        if (schedules.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete bus with assigned schedules'
            });
        }

        // Sửa: Lấy kết quả [result]
        const [result] = await pool.execute('DELETE FROM bus WHERE bus_id = ?', [id]);

        // Sửa: Kiểm tra affectedRows
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        return res.status(200).json({
            message: 'Bus deleted successfully'
        });
    } catch (err) {
        console.error(`Error in deleteBus (id: ${id}):`, err);
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