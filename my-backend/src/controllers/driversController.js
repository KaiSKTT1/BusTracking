import DriverModel from "../models/driverModel.js";

const DriverController = {
    // 🔹 GET all
    getAllDrivers: async (req, res) => {
        try {
            const drivers = await DriverModel.getAll();
            return res.status(200).json({ message: "ok", data: drivers });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    // 🔹 GET by ID
    getDriverById: async (req, res) => {
        try {
            const { id } = req.params;
            const driver = await DriverModel.getById(id);

            if (!driver)
                return res.status(404).json({ message: "Driver not found" });

            return res.status(200).json({ message: "ok", data: driver });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    // 🔹 CREATE (tạo tài xế mới)
    createDriver: async (req, res) => {
        const { username, email, password, status = "active" } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Missing required fields: username, email, password",
            });
        }

        try {
            const existing = await DriverModel.findByEmail(email);
            if (existing.length > 0)
                return res.status(400).json({ message: "Email already exists" });

            const id = await DriverModel.create(username, email, password, status);
            return res
                .status(201)
                .json({ message: "Driver created successfully", data: { id } });
        } catch (err) {
            console.error("❌ Error creating driver:", err);
            return res.status(500).json({ message: err.message });
        }
    },

    // 🔹 UPDATE (chỉnh sửa thông tin tài xế)
    updateDriver: async (req, res) => {
        const { id } = req.params;
        const { username, email, password, status = "active" } = req.body;

        if (!username || !email) {
            return res.status(400).json({
                message: "Missing required fields: username, email",
            });
        }

        try {
            if (!(await DriverModel.exists(id))) {
                return res.status(404).json({ message: "Driver not found" });
            }

            const existing = await DriverModel.findByEmail(email, id);
            if (existing.length > 0)
                return res.status(400).json({ message: "Email already exists" });

            await DriverModel.update(id, username, email, password, status);
            return res.status(200).json({ message: "Driver updated successfully" });
        } catch (err) {
            console.error("❌ Error updating driver:", err);
            return res.status(500).json({ message: err.message });
        }
    },

    // 🔹 DELETE
    deleteDriver: async (req, res) => {
        const { id } = req.params;

        try {
            if (!(await DriverModel.exists(id))) {
                return res.status(404).json({ message: "Driver not found" });
            }

            if (await DriverModel.hasBuses(id)) {
                return res.status(400).json({
                    message: "Cannot delete driver with assigned buses",
                });
            }

            await DriverModel.delete(id);
            return res.status(200).json({ message: "Driver deleted successfully" });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },
};

export default DriverController;
