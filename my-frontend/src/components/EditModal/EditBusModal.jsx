import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../utils/axios";
import { formatDate } from "../../utils/dateFormat.jsx";

const EditBusModal = ({ item, onClose, onSave }) => {
    if (!item) return null;

    const [formData, setFormData] = useState({
        license_plate: item.license_plate || "",
        seats: item.seats || "",
        driver_id: item.driver_id || "",
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

    const handleSubmit = () => {
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
                className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Edit Bus Information</h2>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
                        >
                            Back
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="space-y-6">
                        {/* Bus ID (Read-only) */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Bus ID</p>
                            <p className="font-semibold text-gray-800 text-lg">#{item.id}</p>
                        </div>

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
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
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
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                                placeholder="e.g., 30"
                                min="1"
                                required
                            />
                        </div>

                        {/* Driver Assignment */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Assigned Driver
                            </label>
                            {loadingDrivers ? (
                                <div className="text-gray-500 text-sm">Loading drivers...</div>
                            ) : (
                                <select
                                    name="driver_id"
                                    value={formData.driver_id}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                                >
                                    <option value="">-- No Driver (Unassigned) --</option>
                                    {drivers.map((driver) => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.name} ({driver.email})
                                        </option>
                                    ))}
                                </select>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Current: {item.driver_name || "Unassigned"}
                            </p>
                        </div>

                        {/* Created Date (Read-only) */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Created Date</p>
                            <p className="font-medium text-gray-800">
                                {formatDate(item.created_at) || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end pt-6 border-t mt-8">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EditBusModal;
