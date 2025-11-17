import pool from "../configs/connectDB.js";

// === QUẢN LÝ CHUYẾN ĐI (TRIP - TEMPLATE) ===

let getAllTrips = async (req, res) => {
    console.log('Fetching all trips...');
    try {
        const [rows] = await pool.execute(`
            SELECT 
                t.trip_id,
                t.effective_date,
                t.time_arrival_first,
                t.time_arrival_end,
                r.name as route_name, 
                ua.username as driver_name
            FROM trip t
            LEFT JOIN route r ON t.route_id = r.route_id
            LEFT JOIN user_account ua ON t.driver_id = ua.user_id
        `);
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        console.error('Error in getAllTrips:', err);
        return res.status(500).json({ message: err.message });
    }
};

let createTrip = async (req, res) => {
    const { effective_date, time_arrival_first, time_arrival_end, route_id, driver_id } = req.body;
    console.log('Creating new trip:', req.body);
    if (!effective_date || !time_arrival_first || !time_arrival_end || !route_id || !driver_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO trip (effective_date, time_arrival_first, time_arrival_end, route_id, driver_id) VALUES (?, ?, ?, ?, ?)',
            [effective_date, time_arrival_first, time_arrival_end, route_id, driver_id]
        );
        return res.status(201).json({ message: 'Trip created', id: result.insertId });
    } catch (err) {
        console.error('Error in createTrip:', err);
        return res.status(500).json({ message: err.message });
    }
};

// === QUẢN LÝ LỊCH TRÌNH (TIMETABLE - EVENT) ===

let createTimetable = async (req, res) => {
    const { planned_date, trip_id, driver_id, bus_id } = req.body;
    console.log('Creating new timetable entry:', req.body);
    if (!planned_date || !trip_id || !driver_id || !bus_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO timetable (planned_date, trip_id, driver_id, bus_id) VALUES (?, ?, ?, ?)',
            [planned_date, trip_id, driver_id, bus_id]
        );
        return res.status(201).json({ message: 'Timetable entry created', id: result.insertId });
    } catch (err) {
        console.error('Error in createTimetable:', err);
        return res.status(500).json({ message: err.message });
    }
};

// Lấy lịch trình theo ngày
let getTimetableByDate = async (req, res) => {
    const { date } = req.params; 
    console.log(`Fetching timetable for date: ${date}`);
    try {
        const [rows] = await pool.execute(`
            SELECT 
                tt.timetable_id, 
                tt.planned_date,
                t.time_arrival_first,
                t.time_arrival_end,
                r.name as route_name,
                ua.username as driver_name,
                b.license as bus_license
            FROM timetable tt
            JOIN trip t ON tt.trip_id = t.trip_id
            JOIN route r ON t.route_id = r.route_id
            JOIN user_account ua ON tt.driver_id = ua.user_id
            JOIN bus b ON tt.bus_id = b.bus_id
            WHERE tt.planned_date = ?
        `, [date]);
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        console.error(`Error in getTimetableByDate (date: ${date}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

// === QUẢN LÝ HỌC SINH ĐI XE (STUDENT_RIDE) ===

let addStudentToTimetable = async (req, res) => {
    const { timetable_id, student_id } = req.body;
    console.log('Adding student to timetable:', req.body);
    if (!timetable_id || !student_id) {
        return res.status(400).json({ message: 'Missing fields: timetable_id, student_id' });
    }
    try {
        await pool.execute('INSERT INTO student_ride (timetable_id, student_id) VALUES (?, ?)', [timetable_id, student_id]);
        return res.status(201).json({ message: 'Student added to timetable' });
    } catch (err) {
        console.error('Error in addStudentToTimetable:', err);
        return res.status(500).json({ message: err.message });
    }
};

// Lấy danh sách học sinh trên 1 chuyến xe (timetable)
let getStudentsOnTimetable = async (req, res) => {
    const { id } = req.params; // Đây là timetable_id
    console.log(`Fetching students for timetable id: ${id}`);
    try {
        const [rows] = await pool.execute(`
            SELECT s.* FROM student s
            JOIN student_ride sr ON s.student_id = sr.student_id
            WHERE sr.timetable_id = ?
        `, [id]);
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        console.error(`Error in getStudentsOnTimetable (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};


export default {
    getAllTrips,
    createTrip,
    createTimetable,
    getTimetableByDate,
    addStudentToTimetable,
    getStudentsOnTimetable
    // Thêm các hàm delete... nếu cần
};