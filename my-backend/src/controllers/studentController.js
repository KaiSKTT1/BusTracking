import pool from "../configs/connectDB.js";

let getAllStudents = async (req, res) => {
    try {
        const query = `
            SELECT 
                s.id,
                s.name,
                s.address,
                s.parent_id,
                u.name as parent_name,
                u.phone as parent_phone,
                u.email as parent_email
            FROM students s
            LEFT JOIN users u ON s.parent_id = u.id
            ORDER BY s.id DESC
        `;
        const [rows] = await pool.execute(query);
        return res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching students:", err);
        return res.status(500).json({ message: err.message });
    }
};

let getStudentById = async (req, res) => {
    let { id } = req.params;
    try {
        const query = `
            SELECT 
                s.id,
                s.name,
                s.address,
                s.parent_id,
                u.name as parent_name,
                u.phone as parent_phone,
                u.email as parent_email
            FROM students s
            LEFT JOIN users u ON s.parent_id = u.id
            WHERE s.id = ?
        `;
        const [rows] = await pool.execute(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        return res.status(200).json(rows[0]);
    } catch (err) {
        console.error("Error fetching student:", err);
        return res.status(500).json({ message: err.message });
    }
};

let createStudent = async (req, res) => {
    let { name, address, parent_id } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Missing required field: name" });
    }

    try {
        await pool.execute(
            `INSERT INTO students (name, address, parent_id) VALUES (?, ?, ?)`,
            [name, address || null, parent_id || null]
        );
        return res.status(201).json({ message: "Student created successfully" });
    } catch (err) {
        console.error("Error creating student:", err);
        return res.status(500).json({ message: err.message });
    }
};

let updateStudent = async (req, res) => {
    let { id } = req.params;
    let { name, address, parent_id } = req.body;

    if (!id || !name) {
        return res.status(400).json({ message: "Missing required params" });
    }

    try {
        await pool.execute(
            `UPDATE students SET name = ?, address = ?, parent_id = ? WHERE id = ?`,
            [name, address || null, parent_id || null, id]
        );
        return res.status(200).json({ message: "Student updated successfully" });
    } catch (err) {
        console.error("Error updating student:", err);
        return res.status(500).json({ message: err.message });
    }
};

let deleteStudent = async (req, res) => {
    let { id } = req.params;
    try {
        await pool.execute("DELETE FROM students WHERE id = ?", [id]);
        return res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
        console.error("Error deleting student:", err);
        return res.status(500).json({ message: err.message });
    }
};

export default {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
};
