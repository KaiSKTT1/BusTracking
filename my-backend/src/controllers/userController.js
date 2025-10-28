import userModel from "../models/userModel.js";

// GET all users
const getAllUsers = async (req, res) => {
    try {
        const [rows] = await userModel.getAllUsersModel();
        return res.status(200).json({ message: "ok", data: rows });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// CREATE new user
const createNewUser = async (req, res) => {
    const { name, phone, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Missing required params" });
    }

    try {
        await userModel.insertUserModel(name, phone, email, password, role);
        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// UPDATE user
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, password, role } = req.body;

    if (!id || !name || !email || !role) {
        return res.status(400).json({ message: "Missing required params" });
    }

    try {
        await userModel.updateUserModel(id, name, phone, email, password, role);
        return res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// DELETE user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Missing required params" });
    }

    try {
        await userModel.deleteUserModel(id);
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export default {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
};
