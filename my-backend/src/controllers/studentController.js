import studentModel from "../models/studentModel.js";

// GET all students
const getAllStudents = async (req, res) => {
    try {
        const [rows] = await studentModel.getAllStudentsModel();
        return res.status(200).json({ message: "ok", data: rows });
    } catch (err) {
        console.error("Error fetching students:", err);
        return res.status(500).json({ message: err.message });
    }
};

// GET student by ID
const getStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await studentModel.getStudentByIdModel(id);
        if (rows.length === 0)
            return res.status(404).json({ message: "Student not found" });

        return res.status(200).json({ message: "ok", data: rows[0] });
    } catch (err) {
        console.error("Error fetching student:", err);
        return res.status(500).json({ message: err.message });
    }
};

// CREATE student
const createStudent = async (req, res) => {
    const { name, address, parent_id } = req.body;

    if (!name)
        return res.status(400).json({ message: "Missing required field: name" });

    try {
        await studentModel.insertStudentModel(name, address, parent_id);
        return res.status(201).json({ message: "Student created successfully" });
    } catch (err) {
        console.error("Error creating student:", err);
        return res.status(500).json({ message: err.message });
    }
};

// UPDATE student
const updateStudent = async (req, res) => {
    const { id } = req.params;
    const { name, address, parent_id } = req.body;

    if (!id || !name)
        return res.status(400).json({ message: "Missing required params" });

    try {
        await studentModel.updateStudentModel(id, name, address, parent_id);
        return res.status(200).json({ message: "Student updated successfully" });
    } catch (err) {
        console.error("Error updating student:", err);
        return res.status(500).json({ message: err.message });
    }
};

// DELETE student
const deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        await studentModel.deleteStudentModel(id);
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
    deleteStudent
};
