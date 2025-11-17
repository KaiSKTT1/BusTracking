import pool from "../configs/connectDB.js";

// GET all reports (cho Admin)
let getAllReports = async (req, res) => {
    console.log('Fetching all reports...');
    try {
        const [rows] = await pool.execute(`
            SELECT 
                b.bao_cao_id, 
                b.date, 
                ua.username as driver_name,
                a.username as admin_name
            FROM baocao b
            JOIN user_account ua ON b.driver_id = ua.user_id
            JOIN user_account a ON b.admin_id = a.user_id
            ORDER BY b.date DESC
        `);
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        console.error('Error in getAllReports:', err);
        return res.status(500).json({ message: err.message });
    }
};

// GET details for one report (cho Admin)
let getReportDetails = async (req, res) => {
    const { id } = req.params; // Đây là bao_cao_id
    console.log(`Fetching details for report id: ${id}`);
    try {
        const [rows] = await pool.execute(`
            SELECT 
                ct.tinh_trang,
                s.name as student_name,
                s.student_id
            FROM chitietbaocao ct
            JOIN student s ON ct.student_id = s.student_id
            WHERE ct.bao_cao_id = ?
        `, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Report details not found' });
        }
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        console.error(`Error in getReportDetails (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

// CREATE new report (cho Tài xế)
let createReport = async (req, res) => {
    console.log('Creating new report...');
    const { admin_id, driver_id, date, details } = req.body;

    if (!admin_id || !driver_id || !date || !details || !Array.isArray(details) || details.length === 0) {
        return res.status(400).json({ message: 'Missing required fields or details array is empty' });
    }

    let conn; 
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        console.log('Transaction started...');

        const [reportResult] = await conn.execute(
            'INSERT INTO baocao (admin_id, driver_id, date) VALUES (?, ?, ?)',
            [admin_id, driver_id, date]
        );
        const bao_cao_id = reportResult.insertId;
        console.log(`Created parent report with id: ${bao_cao_id}`);

        for (const detail of details) {
            if (!detail.student_id || !detail.tinh_trang) {
                throw new Error('Invalid detail object: missing student_id or tinh_trang');
            }
            await conn.execute(
                'INSERT INTO chitietbaocao (bao_cao_id, student_id, tinh_trang) VALUES (?, ?, ?)',
                [bao_cao_id, detail.student_id, detail.tinh_trang]
            );
        }
        console.log(`Inserted ${details.length} details...`);

        await conn.commit();
        console.log('Transaction committed.');
        
        return res.status(201).json({ message: 'Report created successfully', id: bao_cao_id });

    } catch (err) {
        console.error('Error in createReport (Transaction rolling back):', err);
        if (conn) await conn.rollback();
        return res.status(500).json({ message: err.message });
    } finally {
        if (conn) conn.release();
        console.log('Connection released.');
    }
};

export default {
    getAllReports,
    getReportDetails,
    createReport
};