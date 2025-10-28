import { motion } from "framer-motion";

const DeleteModal = ({ item, onClose, onConfirm }) => {
    if (!item) return null;

    const handleConfirm = () => {
        onConfirm(item);
        onClose();
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
                className="bg-white rounded-lg shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white rounded-t-lg">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Confirm Delete
                    </h2>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 text-lg mb-4">
                        Are you sure you want to delete this item?
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        {/* For Users/Drivers/Guardians */}
                        {item.name && (
                            <>
                                <p className="font-semibold text-red-900 text-lg">{item.name}</p>
                                {item.email && (
                                    <p className="text-sm text-red-700 mt-1">{item.email}</p>
                                )}
                            </>
                        )}

                        {/* For Buses */}
                        {item.license_plate && (
                            <>
                                <p className="text-sm text-red-600 font-medium">Bus ID: #{item.id}</p>
                                <p className="font-semibold text-red-900 text-lg mt-1">
                                    License Plate: {item.license_plate}
                                </p>
                                <p className="text-sm text-red-700 mt-1">
                                    Seats: {item.seats} | Driver: {item.driver_name || "Unassigned"}
                                </p>
                            </>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">
                        ⚠️ This action cannot be undone. All data associated with this item will be permanently deleted.
                    </p>
                </div>

                {/* Footer - Action Buttons */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DeleteModal;
