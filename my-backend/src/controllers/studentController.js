import pool from "../configs/connectDB.js";

let getAllStudents = async (req, res) => {
    try {
        // Sửa: Tên bảng, tên cột và JOIN
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
        const [rows] = await pool.execute(query);
        return res.status(200).json(rows); // Sửa: Chỉ trả về rows theo code cũ
    } catch (err) {
        console.error("Error fetching students:", err);
        return res.status(500).json({ message: err.message });
    }
};

let getStudentById = async (req, res) => {
    let { id } = req.params;
    try {
        // Sửa: Tên bảng, tên cột và JOIN
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
        console.error("Error fetching student:", err);
        return res.status(500).json({ message: err.message });
    }
};

let createStudent = async (req, res) => {
    // Sửa: Bỏ 'address', thay bằng 'note'. 'parent_id' -> 'id_ph'
    let { name, note, id_ph } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Missing required field: name" });
    }

    try {
        // Sửa: Tên bảng và cột
        await pool.execute(
            `INSERT INTO student (name, note, id_ph, school_id) VALUES (?, ?, ?, ?)`,
            // Tạm thời hardcode school_id = 1, bạn nên thêm school_id vào req.body
            [name, note || null, id_ph || null, 1] 
        );
        return res.status(201).json({ message: "Student created successfully" });
    } catch (err) {
        console.error("Error creating student:", err);
        return res.status(500).json({ message: err.message });
    }
};

let updateStudent = async (req, res) => {
    let { id } = req.params;
    // Sửa: Bỏ 'address', thay bằng 'note'. 'parent_id' -> 'id_ph'
    let { name, note, id_ph } = req.body;

    if (!id || !name) {
        return res.status(400).json({ message: "Missing required params" });
    }

    try {
        // Sửa: Tên bảng và cột
        await pool.execute(
            `UPDATE student SET name = ?, note = ?, id_ph = ? WHERE student_id = ?`,
            [name, note || null, id_ph || null, id]
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
        // Sửa: Phải xoá ở bảng student_ride trước do có khoá ngoại
        await pool.execute("DELETE FROM student_ride WHERE student_id = ?", [id]);
        
        // Sửa: Xoá ở bảng chitietbaocao trước
        await pool.execute("DELETE FROM chitietbaocao WHERE student_id = ?", [id]);

        // Sửa: Xoá student
        await pool.execute("DELETE FROM student WHERE student_id = ?", [id]);
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