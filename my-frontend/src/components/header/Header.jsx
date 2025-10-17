import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ICONS } from "../../config/ICONS";
import avatarDefault from "../../assets/image/avatar-default.png";

const Header = (props) => {
    const [modal, setModal] = useState(false);
    const BellIcon = ICONS.bell;

    const showModal = () => setModal(!modal);

    return (
        <div className="flex justify-end items-center p-4">
            <div className="relative">
                <BellIcon
                    size={32}
                    onClick={showModal}
                    className={`cursor-pointer transition-colors duration-300 ${
                        modal ? "text-orange-500" : "text-gray-700"
                    }`}
                />

                <button
                    onClick={showModal}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                >
                    123
                </button>

                <AnimatePresence mode="wait">
                    {modal && (
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

            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 ml-4">
                <img
                    src={props.avatar || avatarDefault}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default Header;
