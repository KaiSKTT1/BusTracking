import { useState } from "react";
import { motion } from "framer-motion";
import { ICONS } from "../../config/ICONS";
import Header from "../../components/header/Header";
import TitlePage from "../../components/title_pages/TitlePage";

const PickupDropoff = () => {
    const [students, setStudents] = useState([
        { id: "S001", name: "Nguyen Van A", class: "1A", bus: "Bus 01", currentStatus: "Chưa đón" },
        { id: "S002", name: "Tran Thi B", class: "2B", bus: "Bus 02", currentStatus: "Đã đón" },
        { id: "S003", name: "Le Van C", class: "3A", bus: "Bus 03", currentStatus: "Chưa đón" },
    ]);

    const [history, setHistory] = useState([]);

    const StudentIcon = ICONS.Students;

    // Hàm xử lý khi bấm Đón hoặc Trả
    const handleAction = (id, type) => {
        const now = new Date();
        const formattedTime = now.toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        const updated = students.map((s) =>
            s.id === id
                ? { ...s, currentStatus: type === "pickup" ? "Đã đón" : "Đã trả" }
                : s
        );
        setStudents(updated);

        const student = students.find((s) => s.id === id);
        const newRecord = {
            id: history.length + 1,
            name: student.name,
            action: type === "pickup" ? "Đón học sinh" : "Trả học sinh",
            time: formattedTime,
        };
        setHistory([newRecord, ...history]);
    };

    return (
        <>
            <Header />
            <div className="p-6">
                <TitlePage
                    title="Danh sách học sinh cần đón / trả"
                    icon={<StudentIcon className="text-green-700" size={30} />}
                    size="text-2xl"
                    color="text-gray-700"
                    className="mb-6"
                />

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-4xl mx-auto"
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="border p-2">Mã HS</th>
                                    <th className="border p-2">Họ tên</th>
                                    <th className="border p-2 hidden sm:table-cell">Lớp</th>
                                    <th className="border p-2 hidden md:table-cell">Tuyến xe</th>
                                    <th className="border p-2">Trạng thái</th>
                                    <th className="border p-2">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s) => (
                                    <tr key={s.id} className="text-center hover:bg-gray-50">
                                        <td className="border p-2">{s.id}</td>
                                        <td className="border p-2">{s.name}</td>
                                        <td className="border p-2 hidden sm:table-cell">{s.class}</td>
                                        <td className="border p-2 hidden md:table-cell">{s.bus}</td>
                                        <td className="border p-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-white text-xs ${s.currentStatus === "Chưa đón"
                                                    ? "bg-gray-500"
                                                    : s.currentStatus === "Đã đón"
                                                        ? "bg-blue-600"
                                                        : "bg-green-600"
                                                    }`}
                                            >
                                                {s.currentStatus}
                                            </span>
                                        </td>
                                        <td className="border p-2">
                                            {s.currentStatus === "Chưa đón" && (
                                                <button
                                                    onClick={() => handleAction(s.id, "pickup")}
                                                    className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition"
                                                >
                                                    ✅ Đón
                                                </button>
                                            )}
                                            {s.currentStatus === "Đã đón" && (
                                                <button
                                                    onClick={() => handleAction(s.id, "drop")}
                                                    className="bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-yellow-600 transition"
                                                >
                                                    🚗 Trả
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>


                {/* Lịch sử đón / trả */}
                {history.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white mt-8 p-6 rounded-xl shadow-md max-w-3xl mx-auto"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            📜 Lịch sử đón / trả
                        </h3>
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="border p-2">STT</th>
                                    <th className="border p-2">Tên học sinh</th>
                                    <th className="border p-2">Hành động</th>
                                    <th className="border p-2">Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((h) => (
                                    <tr key={h.id} className="text-center">
                                        <td className="border p-2">{h.id}</td>
                                        <td className="border p-2">{h.name}</td>
                                        <td className="border p-2">{h.action}</td>
                                        <td className="border p-2">{h.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default PickupDropoff;
