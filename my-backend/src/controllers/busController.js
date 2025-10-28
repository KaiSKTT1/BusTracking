import busModel from "../models/busModel.js";

const BusController = {
    // GET all
    getAllBuses: async (req, res) => {
        try {
            const buses = await busModel.getAll();
            return res.status(200).json({ message: "ok", data: buses });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    // GET by ID
    getBusById: async (req, res) => {
        try {
            const { id } = req.params;
            const bus = await busModel.getById(id);

            if (!bus) return res.status(404).json({ message: "Bus not found" });
            return res.status(200).json({ message: "ok", data: bus });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    // CREATE
    createBus: async (req, res) => {
        const { license_plate, seats, driver_id } = req.body;

        if (!license_plate || !seats) {
            return res.status(400).json({ message: "Missing required fields: license_plate, seats" });
        }

        try {
            // Check duplicate
            const existing = await busModel.findByLicensePlate(license_plate);
            if (existing.length > 0) {
                return res.status(400).json({ message: "License plate already exists" });
            }

            // Validate driver
            if (driver_id && !(await busModel.isValidDriver(driver_id))) {
                return res.status(400).json({ message: "Invalid driver ID" });
            }

            const id = await busModel.create(license_plate, seats, driver_id);
            return res.status(201).json({ message: "Bus created successfully", data: { id } });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    // UPDATE
    updateBus: async (req, res) => {
        const { id } = req.params;
        const { license_plate, seats, driver_id } = req.body;

        if (!license_plate || !seats) {
            return res.status(400).json({ message: "Missing required fields: license_plate, seats" });
        }

        try {
            if (!(await busModel.exists(id))) {
                return res.status(404).json({ message: "Bus not found" });
            }

            const existing = await busModel.findByLicensePlate(license_plate, id);
            if (existing.length > 0) {
                return res.status(400).json({ message: "License plate already exists" });
            }

            if (driver_id && !(await busModel.isValidDriver(driver_id))) {
                return res.status(400).json({ message: "Invalid driver ID" });
            }

            await busModel.update(id, license_plate, seats, driver_id);
            return res.status(200).json({ message: "Bus updated successfully" });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    // DELETE
    deleteBus: async (req, res) => {
        const { id } = req.params;

        try {
            if (!(await busModel.exists(id))) {
                return res.status(404).json({ message: "Bus not found" });
            }

            if (await busModel.hasSchedules(id)) {
                return res.status(400).json({ message: "Cannot delete bus with assigned schedules" });
            }

            await busModel.delete(id);
            return res.status(200).json({ message: "Bus deleted successfully" });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
};

export default BusController;
