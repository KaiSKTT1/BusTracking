import pool from "../configs/connectDB.js";

const getAllStudentsModel = () => {
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
    return pool.execute(query);
};

const getStudentByIdModel = (id) => {
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
    return pool.execute(query, [id]);
};

const insertStudentModel = (name, address, parent_id) => {
    return pool.execute(
        "INSERT INTO students (name, address, parent_id) VALUES (?, ?, ?)",
        [name, address || null, parent_id || null]
    );
};

const updateStudentModel = (id, name, address, parent_id) => {
    return pool.execute(
        "UPDATE students SET name = ?, address = ?, parent_id = ? WHERE id = ?",
        [name, address || null, parent_id || null, id]
    );
};

const deleteStudentModel = (id) => {
    return pool.execute("DELETE FROM students WHERE id = ?", [id]);
};

export default {
    getAllStudentsModel,
    getStudentByIdModel,
    insertStudentModel,
    updateStudentModel,
    deleteStudentModel
};
