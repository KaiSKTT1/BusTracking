import pool from "../configs/connectDB.js";

// GET all guardians
const getAllGuardiansModel = () => {
    return pool.execute("SELECT id, name, phone, email, role, created_at FROM users WHERE role = 'Parent'");
};

// GET guardian by ID
const getGuardianByIdModel = (id) => {
    return pool.execute("SELECT id, name, phone, email, role, created_at FROM users WHERE id = ? AND role = 'Parent'", [id]);
};

// Check email exists
const checkGuardianEmailExists = (email, excludeId = null) => {
    if (excludeId)
        return pool.execute("SELECT id FROM users WHERE email = ? AND id != ?", [email, excludeId]);
    return pool.execute("SELECT id FROM users WHERE email = ?", [email]);
};

// Insert guardian
const insertGuardianModel = (name, phone, email, password) => {
    return pool.execute(
        "INSERT INTO users (name, phone, email, password, role) VALUES (?, ?, ?, ?, 'Parent')",
        [name, phone || null, email, password]
    );
};

// Update guardian
const updateGuardianModel = (id, name, phone, email, password) => {
    if (password) {
        return pool.execute(
            "UPDATE users SET name = ?, phone = ?, email = ?, password = ? WHERE id = ?",
            [name, phone || null, email, password, id]
        );
    }
    return pool.execute(
        "UPDATE users SET name = ?, phone = ?, email = ? WHERE id = ?",
        [name, phone || null, email, id]
    );
};

// Delete guardian
const deleteGuardianModel = (id) => {
    return pool.execute("DELETE FROM users WHERE id = ?", [id]);
};

// Check guardian has students
const checkGuardianHasStudents = (id) => {
    return pool.execute("SELECT id FROM students WHERE parent_id = ?", [id]);
};

export default {
    getAllGuardiansModel,
    getGuardianByIdModel,
    checkGuardianEmailExists,
    insertGuardianModel,
    updateGuardianModel,
    deleteGuardianModel,
    checkGuardianHasStudents
};
