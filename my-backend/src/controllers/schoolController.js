import pool from "../configs/connectDB.js";

// GET all schools
let getAllSchools = async (req, res) => {
    console.log('Fetching all schools...');
    try {
        const [rows] = await pool.execute('SELECT * FROM school ORDER BY name ASC');
        // Sửa: Gửi về đúng định dạng mà code School.jsx của bạn đang mong đợi
        return res.status(200).json({ message: 'ok', data: rows }); 
    } catch (err) {
        console.error('Error in getAllSchools:', err);
        return res.status(500).json({ message: err.message });
    }
};

// CREATE new school
let createSchool = async (req, res) => {
    const { name } = req.body;
    console.log('Creating new school with name:', name);
    if (!name) {
        return res.status(400).json({ message: 'Missing required field: name' });
    }
    try {
        const [result] = await pool.execute('INSERT INTO school (name) VALUES (?)', [name]);
        return res.status(201).json({ message: 'School created', id: result.insertId });
    } catch (err) {
        console.error('Error in createSchool:', err);
        return res.status(500).json({ message: err.message });
    }
};

// UPDATE school
let updateSchool = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    console.log(`Updating school ${id} with name:`, name);
    if (!name) {
        return res.status(400).json({ message: 'Missing required field: name' });
    }
    try {
        const [result] = await pool.execute('UPDATE school SET name = ? WHERE school_id = ?', [name, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'School not found' });
        }
        return res.status(200).json({ message: 'School updated' });
    } catch (err) {
        console.error(`Error in updateSchool (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

// DELETE school
let deleteSchool = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting school with id: ${id}`);
    try {
        // Kiểm tra ràng buộc khoá ngoại
        const [students] = await pool.execute('SELECT student_id FROM student WHERE school_id = ?', [id]);
        if (students.length > 0) {
            return res.status(400).json({ message: 'Cannot delete school with assigned students' });
        }

        const [result] = await pool.execute('DELETE FROM school WHERE school_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'School not found' });
        }
        return res.status(200).json({ message: 'School deleted' });
    } catch (err) {
        console.error(`Error in deleteSchool (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

export default {
    getAllSchools,
    createSchool,
    updateSchool,
    deleteSchool
};