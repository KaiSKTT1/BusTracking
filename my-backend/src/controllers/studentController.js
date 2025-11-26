import pool from "../configs/connectDB.js";

let getAllStudents = async (req, res) => {
    console.log('Fetching all students...');
    try {
        const query = `
            SELECT 
                s.student_id as id,
                s.name,
                s.school_id,
                s.note,
                s.id_ph as parent_id,
                u.username as parent_name,
                u.email as parent_email
            FROM student s
            LEFT JOIN user_account u ON s.id_ph = u.user_id
            ORDER BY s.student_id DESC
        `;
        const [rows] = await pool.execute(query, [id_ph]);
        return res.status(200).json(rows);
    } catch (err) {
        console.error("Error in getAllStudents:", err);
        return res.status(500).json({ message: err.message });
    }
};
let getStudentsByParentId = async (req, res) => {
    let { id_ph } = req.params;
    try {
        const query = `
            SELECT
                s.student_id,
                s.name,
                s.id_ph,
                u.name as parent_name,
                u.phone as parent_phone,
                u.email as parent_email
            FROM students s
            LEFT JOIN users u ON s.id_ph = user.id
            WHERE s.id_ph = ?
            ORDER BY s.id_ph DESC
        `;
        const [rows] = await pool.execute(query, [id_ph]);
        return res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching students by parent ID:", err);
        return res.status(500).json({ message: err.message });
    }
};

let getStudentById = async (req, res) => {
    let { id } = req.params;
    console.log(`Fetching student with id: ${id}`);
    try {
        const query = `
            SELECT 
                s.student_id as id,
                s.name,
                s.school_id,
                s.note,
                s.id_ph as parent_id,
                u.username as parent_name,
                u.email as parent_email
            FROM student s
            LEFT JOIN user_account u ON s.id_ph = u.user_id
            WHERE s.student_id = ?
        `;
        const [rows] = await pool.execute(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        return res.status(200).json(rows[0]);
    } catch (err) {
        console.error(`Error in getStudentById (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

let createStudent = async (req, res) => {
    console.log('Creating new student with body:', req.body);
    let { name, note, id_ph, school_id } = req.body; // Thêm school_id

    if (!name || !school_id) { // Bắt buộc phải có name và school_id
        return res.status(400).json({ message: "Missing required fields: name, school_id" });
    }

    try {
        await pool.execute(
            `INSERT INTO student (name, note, id_ph, school_id) VALUES (?, ?, ?, ?)`,
            [name, note || null, id_ph || null, school_id] 
        );
        return res.status(201).json({ message: "Student created successfully" });
    } catch (err) {
        console.error("Error in createStudent:", err);
        return res.status(500).json({ message: err.message });
    }
};

let updateStudent = async (req, res) => {
    let { id } = req.params;
    let { name, note, id_ph, school_id } = req.body; // Thêm school_id
    console.log(`Updating student ${id} with body:`, req.body);

    if (!id || !name || !school_id) { // Bắt buộc phải có
        return res.status(400).json({ message: "Missing required params: id, name, school_id" });
    }

    try {
        // Sửa: Lấy kết quả [result]
        const [result] = await pool.execute(
            `UPDATE student SET name = ?, note = ?, id_ph = ?, school_id = ? WHERE student_id = ?`,
            [name, note || null, id_ph || null, school_id, id]
        );

        // Sửa: Kiểm tra affectedRows
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found or data unchanged' });
        }

        return res.status(200).json({ message: "Student updated successfully" });
    } catch (err) {
        console.error(`Error in updateStudent (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

let deleteStudent = async (req, res) => {
    let { id } = req.params;
    console.log(`Deleting student with id: ${id}`);
    try {
        // Xoá các ràng buộc trước
        await pool.execute("DELETE FROM student_ride WHERE student_id = ?", [id]);
        await pool.execute("DELETE FROM chitietbaocao WHERE student_id = ?", [id]);

        // Sửa: Lấy kết quả [result]
        const [result] = await pool.execute("DELETE FROM student WHERE student_id = ?", [id]);
        
        // Sửa: Kiểm tra affectedRows
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
        console.error(`Error in deleteStudent (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

export default {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentsByParentId
};