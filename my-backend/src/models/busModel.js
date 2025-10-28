import pool from "../configs/connectDB.js";

const BusModel = {
    getAll: async () => {
        const [rows] = await pool.execute(`
      SELECT 
        b.id, 
        b.license_plate, 
        b.seats, 
        b.driver_id,
        b.created_at,
        u.name AS driver_name,
        u.email AS driver_email,
        u.phone AS driver_phone
      FROM bus b
      LEFT JOIN users u ON b.driver_id = u.id AND u.role = 'Driver'
    `);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.execute(`
      SELECT 
        b.id, 
        b.license_plate, 
        b.seats, 
        b.driver_id,
        b.created_at,
        u.name AS driver_name,
        u.email AS driver_email,
        u.phone AS driver_phone
      FROM bus b
      LEFT JOIN users u ON b.driver_id = u.id AND u.role = 'Driver'
      WHERE b.id = ?
    `, [id]);
        return rows[0];
    },

    findByLicensePlate: async (plate, excludeId = null) => {
        if (excludeId) {
            const [rows] = await pool.execute(
                `SELECT id FROM bus WHERE license_plate = ? AND id != ?`,
                [plate, excludeId]
            );
            return rows;
        }
        const [rows] = await pool.execute(
            `SELECT id FROM bus WHERE license_plate = ?`,
            [plate]
        );
        return rows;
    },

    create: async (license_plate, seats, driver_id) => {
        const [result] = await pool.execute(
            `INSERT INTO bus (license_plate, seats, driver_id) VALUES (?, ?, ?)`,
            [license_plate, seats, driver_id || null]
        );
        return result.insertId;
    },

    update: async (id, license_plate, seats, driver_id) => {
        await pool.execute(
            `UPDATE bus SET license_plate = ?, seats = ?, driver_id = ? WHERE id = ?`,
            [license_plate, seats, driver_id || null, id]
        );
    },

    delete: async (id) => {
        await pool.execute(`DELETE FROM bus WHERE id = ?`, [id]);
    },

    exists: async (id) => {
        const [rows] = await pool.execute(`SELECT id FROM bus WHERE id = ?`, [id]);
        return rows.length > 0;
    },

    hasSchedules: async (id) => {
        const [rows] = await pool.execute(`SELECT id FROM schedules WHERE bus_id = ?`, [id]);
        return rows.length > 0;
    },

    isValidDriver: async (driver_id) => {
        const [rows] = await pool.execute(
            `SELECT id FROM users WHERE id = ? AND role = 'Driver'`,
            [driver_id]
        );
        return rows.length > 0;
    }
};

export default BusModel;
