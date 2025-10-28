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
    // 🔹 Tài xế xác nhận đã đón học sinh
    // 🔹 1️⃣ Tài xế báo đã đón học sinh
    sendPickedUpNotification: async (req, res) => {
        try {
            const { driver_id, student_id, bus_id } = req.body;

            if (!driver_id || !student_id || !bus_id) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const message = `Tài xế đã đón học sinh ID ${student_id}.`;
            const notifId = await DriverModel.sendNotification({
                sender_id: driver_id,
                student_id,
                bus_id,
                message,
                type: "picked_up",
            });

            if (!notifId) {
                return res.status(200).json({
                    message: "already_picked_up_today",
                    detail: "Học sinh này đã được đánh dấu là đón hôm nay.",
                });
            }

            return res.status(201).json({
                message: "success",
                detail: "Đã gửi thông báo học sinh đã được đón",
                notification_id: notifId,
            });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    // 🔹 2️⃣ Tài xế báo chưa đón được học sinh
    sendNotPickedUpNotification: async (req, res) => {
        try {
            const { driver_id, student_id, bus_id, reason } = req.body;

            if (!driver_id || !student_id || !bus_id || !reason) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const message = `Không thể đón học sinh ID ${student_id}. Lý do: ${reason}`;
            const notifId = await DriverModel.sendNotification({
                sender_id: driver_id,
                student_id,
                bus_id,
                message,
                type: "not_picked_up",
            });

            if (!notifId) {
                return res.status(200).json({
                    message: "already_not_picked_up_today",
                    detail: "Đã gửi thông báo không đón được học sinh này hôm nay.",
                });
            }

            return res.status(201).json({
                message: "success",
                detail: "Đã gửi thông báo chưa đón được học sinh",
                notification_id: notifId,
            });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    // 🔹 3️⃣ Tài xế báo sự cố
    sendIncidentNotification: async (req, res) => {
        try {
            const { driver_id, bus_id, message } = req.body;

            if (!driver_id || !bus_id || !message) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const notifId = await DriverModel.sendNotification({
                sender_id: driver_id,
                bus_id,
                message,
                type: "incident",
            });

            return res.status(201).json({
                message: "success",
                detail: "Đã gửi thông báo sự cố",
                notification_id: notifId,
            });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

};

export default DriverController;
