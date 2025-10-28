import { motion } from "framer-motion";
import { formatDate } from "../../utils/dateFormat.jsx";

const DetailBusModal = ({ item, onClose, editModal }) => {
    if (!item) return null;

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
                        <h2 className="text-2xl font-bold">Bus Information</h2>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => editModal(item)}
                                className="px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Bus ID */}
                        <div className="col-span-2 bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <p className="text-sm text-orange-600 mb-1 font-medium">Bus ID</p>
                            <p className="font-bold text-orange-800 text-2xl">#{item.id}</p>
                        </div>

                        {/* License Plate */}
                        <div>
                            <p className="text-sm text-gray-500 mb-1">License Plate</p>
                            <p className="font-semibold text-gray-800 text-lg">{item.license_plate}</p>
                        </div>

                        {/* Number of Seats */}
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Number of Seats</p>
                            <p className="font-semibold text-gray-800 text-lg">{item.seats}</p>
                        </div>

                        {/* Assigned Driver */}
                        <div className="col-span-2">
                            <p className="text-sm text-gray-500 mb-2">Assigned Driver</p>
                            {item.driver_name ? (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="font-semibold text-gray-800 text-lg mb-2">{item.driver_name}</p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-gray-500">Email:</span>
                                            <span className="ml-2 text-gray-700">{item.driver_email || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Phone:</span>
                                            <span className="ml-2 text-gray-700">{item.driver_phone || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p className="text-gray-400 italic">No driver assigned</p>
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Status</p>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${item.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                    }`}
                            >
                                {item.status}
                            </span>
                        </div>

                        {/* Created Date */}
                        <div className="col-span-2">
                            <p className="text-sm text-gray-500 mb-1">Created Date</p>
                            <p className="font-medium text-gray-800">
                                {formatDate(item.created_at) || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DetailBusModal;
