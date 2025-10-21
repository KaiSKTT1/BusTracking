import pool from "../configs/connectDB.js";

let getAllStudents = async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM Student");
        return res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

let getStudentById = async (req, res) => {
    let { id } = req.params;
    try {
        const [rows] = await pool.execute("SELECT * FROM Student WHERE student_id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        return res.status(200).json(rows[0]);
    } catch (err) {
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
            `INSERT INTO Student (name, address, parent_id) VALUES (?, ?, ?)`,
            [name, address || null, parent_id || null]
        );
        return res.status(201).json({ message: "Student created" });
    } catch (err) {
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
            `UPDATE Student SET name = ?, address = ?, parent_id = ? WHERE id = ?`,
            [name, address || null, parent_id || null, id]
        );
        return res.status(200).json({ message: "Student updated" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

let deleteStudent = async (req, res) => {
    let { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Missing required param: id" });
    }

    try {
        await pool.execute(`DELETE FROM Student WHERE id = ?`, [id]);
        return res.status(200).json({ message: "Student deleted" });
    } catch (err) {
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
