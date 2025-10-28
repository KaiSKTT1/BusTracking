import guardianModel from "../models/guardianModel.js";

// GET all guardians
const getAllGuardians = async (req, res) => {
    try {
        const [rows] = await guardianModel.getAllGuardiansModel();
        return res.status(200).json({ message: "ok", data: rows });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET guardian by ID
const getGuardianById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await guardianModel.getGuardianByIdModel(id);
        if (rows.length === 0)
            return res.status(404).json({ message: "Guardian not found" });

        return res.status(200).json({ message: "ok", data: rows[0] });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// CREATE guardian
const createGuardian = async (req, res) => {
    const { name, phone, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({
            message: "Missing required fields: name, email, password"
        });

    try {
        const [existing] = await guardianModel.checkGuardianEmailExists(email);
        if (existing.length > 0)
            return res.status(400).json({ message: "Email already exists" });

        const [result] = await guardianModel.insertGuardianModel(name, phone, email, password);
        return res.status(201).json({
            message: "Guardian created successfully",
            data: { id: result.insertId }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// UPDATE guardian
const updateGuardian = async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, password } = req.body;

    if (!name || !email)
        return res.status(400).json({
            message: "Missing required fields: name, email"
        });

    try {
        const [guardian] = await guardianModel.getGuardianByIdModel(id);
        if (guardian.length === 0)
            return res.status(404).json({ message: "Guardian not found" });

        const [existing] = await guardianModel.checkGuardianEmailExists(email, id);
        if (existing.length > 0)
            return res.status(400).json({ message: "Email already exists" });

        await guardianModel.updateGuardianModel(id, name, phone, email, password);
        return res.status(200).json({ message: "Guardian updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// DELETE guardian
const deleteGuardian = async (req, res) => {
    const { id } = req.params;
    try {
        const [guardian] = await guardianModel.getGuardianByIdModel(id);
        if (guardian.length === 0)
            return res.status(404).json({ message: "Guardian not found" });

        const [students] = await guardianModel.checkGuardianHasStudents(id);
        if (students.length > 0)
            return res.status(400).json({
                message: "Cannot delete guardian with assigned students"
            });

        await guardianModel.deleteGuardianModel(id);
        return res.status(200).json({ message: "Guardian deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export default {
    getAllGuardians,
    getGuardianById,
    createGuardian,
    updateGuardian,
    deleteGuardian
};
