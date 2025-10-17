import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import avatar from "../../assets/image/avatar-default.png";

// Component Modal hiển thị chi tiết
const DetailModal = ({ item, onClose, editModal }) => {
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
                className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Account Information</h2>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                // Khi muốn truyền tham số thì sài arrow func
                                onClick={() => editModal(item)}
                                className="px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex p-8 gap-8">
                    <div className="flex-shrink-0">
                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                            <img
                                src={avatar}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="grid grid-cols-2 gap-6">
                            {/* User name */}
                            <div>
                                <p className="text-sm text-gray-500 mb-1">User name</p>
                                <p className="font-semibold text-gray-800 text-lg">{item.name}</p>
                            </div>

                            {/* Email */}
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Email Parent</p>
                                <p className="font-semibold text-gray-800 text-lg">{item.email}</p>
                            </div>

                            {/* Registered */}
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Registered</p>
                                <p className="font-medium text-gray-800">{item.registered}</p>
                            </div>

                            {/* Phone */}
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Phone Parent</p>
                                <p className="font-medium text-gray-800">{item.phone}</p>
                            </div>

                            {/* Role */}
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Role</p>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {item.role}
                                </span>
                            </div>

                            {/* Status */}
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Status</p>
                                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    {item.status}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DetailModal;