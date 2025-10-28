import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ICONS } from "../../config/ICONS";
import avatarDefault from "../../assets/image/avatar-default.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/apiRequest";

const Header = (props) => {
    const [bellOpen, setBellOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const BellIcon = ICONS.bell;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleBell = () => setBellOpen(!bellOpen);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleLogout = () => {
        // ✅ Xóa token & chuyển về trang chọn vai trò
        logoutUser(dispatch, navigate);

    };

    return (
        <div className="flex justify-end items-center p-4 relative">
            {/* 🔔 Bell Notification */}
            <div className="relative">
                <BellIcon
                    size={32}
                    onClick={toggleBell}
                    className={`cursor-pointer transition-colors duration-300 ${bellOpen ? "text-orange-500" : "text-gray-700"
                        }`}
                />

                <button
                    onClick={toggleBell}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                >
                    3
                </button>

                <AnimatePresence>
                    {bellOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-y-auto max-h-60 p-2 z-50"
                        >
                            <p className="text-gray-600 text-sm">
                                Không có thông báo mới.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 🧑 Avatar */}
            <div className="relative ml-4">
                <div
                    className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 cursor-pointer"
                    onClick={toggleMenu}
                >
                    <img
                        src={props.avatar || avatarDefault}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* ⚙️ Dropdown Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50"
                        >
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                                Đăng xuất
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Header;
