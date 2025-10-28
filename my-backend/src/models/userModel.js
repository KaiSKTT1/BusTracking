import pool from "../configs/connectDB.js";

const getAllUsersModel = () => {
    return pool.execute("SELECT * FROM Users");
};

const insertUserModel = (name, phone, email, password, role) => {
    return pool.execute(
        `INSERT INTO Users (name, phone, email, password, role) VALUES (?, ?, ?, ?, ?)`,
        [name, phone || null, email, password, role]
    );
};

const updateUserModel = (id, name, phone, email, password, role) => {
    return pool.execute(
        `UPDATE Users SET name = ?, phone = ?, email = ?, password = ?, role = ? WHERE id = ?`,
        [name, phone || null, email, password || null, role, id]
    );
};

const deleteUserModel = (id) => {
    return pool.execute("DELETE FROM Users WHERE id = ?", [id]);
};

export default {
    getAllUsersModel,
    insertUserModel,
    updateUserModel,
    deleteUserModel,
};
