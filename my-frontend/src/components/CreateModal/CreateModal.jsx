import { useState } from "react";
import { motion } from "framer-motion";
import avatar from "../../assets/image/avatar-default.png";

const CreateModal = ({ onClose, onSave, defaultRole, requirePassword = false }) => {
    // Khởi tạo form, role mặc định sẽ đến từ props
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: defaultRole || "",
        status: "Active",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
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
                className="bg-white rounded-lg shadow-2xl max-w-3xl w-full"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white flex justify-between items-center rounded-t-lg">
                    <h2 className="text-2xl font-bold">Create New {defaultRole}</h2>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                                    placeholder={`Enter ${defaultRole} name`}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                                    placeholder="Enter email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            {/* Chỉ hiện password field nếu requirePassword = true */}
                            {requirePassword && (
                                <div>
                                    <label className="text-sm text-gray-600 block mb-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>
                            )}

                            {/* Ẩn role đi vì nó cố định cho từng trang */}
                            <input type="hidden" name="role" value={formData.role} />
                            
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="submit"
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default CreateModal;
