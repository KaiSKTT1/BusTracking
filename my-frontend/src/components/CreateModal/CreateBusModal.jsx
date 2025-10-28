import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../utils/axios";

const CreateBusModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        license_plate: "",
        seats: "",
        driver_id: "",
    });

    const [drivers, setDrivers] = useState([]);
    const [loadingDrivers, setLoadingDrivers] = useState(true);

    // Fetch available drivers
    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await api.get("/drivers");
            const driverData = Array.isArray(response.data.data)
                ? response.data.data
                : Array.isArray(response.data)
                    ? response.data
                    : [];
            setDrivers(driverData);
        } catch (error) {
            console.error("Error fetching drivers:", error);
        } finally {
            setLoadingDrivers(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            seats: parseInt(formData.seats),
            driver_id: formData.driver_id ? parseInt(formData.driver_id) : null,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-2xl max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white flex justify-between items-center rounded-t-lg">
                    <h2 className="text-2xl font-bold">Create New Bus</h2>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        {/* License Plate */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                License Plate <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="license_plate"
                                value={formData.license_plate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                                placeholder="e.g., 51B-12345"
                                required
                            />
                        </div>

                        {/* Seats */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Number of Seats <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="seats"
                                value={formData.seats}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                                placeholder="e.g., 30"
                                min="1"
                                required
                            />
                        </div>

                        {/* Driver (Optional) */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Assign Driver (Optional)
                            </label>
                            {loadingDrivers ? (
                                <div className="text-gray-500 text-sm">Loading drivers...</div>
                            ) : (
                                <select
                                    name="driver_id"
                                    value={formData.driver_id}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                                >
                                    <option value="">-- No Driver (Unassigned) --</option>
                                    {drivers.map((driver) => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.name} ({driver.email})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Create Bus
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default CreateBusModal;
