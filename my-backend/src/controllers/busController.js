import pool from '../configs/connectDB.js';


let getAllBuses = async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM Bus");
        return res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


let createBus = async (req, res) => {
    let { license_plate, seats, driver_id } = req.body;

    if (!license_plate || !seats) {
        return res.status(400).json({
            message: 'Missing required fields (license_plate, seats)'
        });
    }

    try {
        await pool.execute(
            `INSERT INTO Bus (license_plate, seats, driver_id) 
             VALUES (?, ?, ?)`,
            [license_plate, seats, driver_id || null]
        );
        return res.status(201).json({ message: 'Bus created' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


let updateBus = async (req, res) => {
    let { id } = req.params;
    let { license_plate, seats, driver_id } = req.body;

    if (!id || !license_plate || !seats) {
        return res.status(400).json({
            message: 'Missing required params'
        });
    }

    try {
        await pool.execute(
            `UPDATE Bus 
             SET license_plate = ?, seats = ?, driver_id = ? 
             WHERE id = ?`,
            [license_plate, seats, driver_id || null, id]
        );
        return res.status(200).json({ message: 'Bus updated' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


let deleteBus = async (req, res) => {
    let { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Missing bus id' });
    }

    try {
        await pool.execute(`DELETE FROM Bus WHERE id = ?`, [id]);
        return res.status(200).json({ message: 'Bus deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export default {
    getAllBuses,
    createBus,
    updateBus,
    deleteBus
};
