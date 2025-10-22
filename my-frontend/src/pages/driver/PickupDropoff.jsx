import { useState } from "react";
import { motion } from "framer-motion";
import { ICONS } from "../../config/ICONS";
import Header from "../../components/header/Header";
import TitlePage from "../../components/title_pages/TitlePage";

const PickupDropoff = () => {
    const [studentCode, setStudentCode] = useState("");
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [history, setHistory] = useState([]);

    const StudentIcon = ICONS.Students;

    // Mock danh sách học sinh
    const mockStudents = [
        { id: "S001", name: "Nguyen Van A", class: "1A", bus: "Bus 01", currentStatus: "Chưa đón" },
        { id: "S002", name: "Tran Thi B", class: "2B", bus: "Bus 02", currentStatus: "Đã đón" },
    ];

    // Hàm tìm học sinh theo mã
    const handleSearch = () => {
        setLoading(true);
        setTimeout(() => {
            const found = mockStudents.find((s) => s.id === studentCode.trim());
            if (found) {
                setStudentInfo(found);
                setMessage("");
            } else {
                setStudentInfo(null);
                setMessage("❌ Không tìm thấy học sinh!");
            }
            setLoading(false);
        }, 500);
    };

    // Xử lý đón hoặc trả
    const handleAction = (type) => {
        if (!studentInfo) return;

        const now = new Date();
        const formattedTime = now.toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        const newStatus = type === "pickup" ? "Đã đón" : "Đã trả";

        // Cập nhật thông tin học sinh
        setStudentInfo({ ...studentInfo, currentStatus: newStatus });

        // Ghi lịch sử
        const newRecord = {
            id: history.length + 1,
            name: studentInfo.name,
            action: type === "pickup" ? "Đón học sinh" : "Trả học sinh",
            time: formattedTime,
        };
        setHistory([newRecord, ...history]); // thêm vào đầu danh sách

        // Thông báo
        setMessage(`✅ ${studentInfo.name} đã được ${type === "pickup" ? "đón" : "trả"} lúc ${formattedTime}`);
    };

    return (
        <>
            <Header />
            <div className="p-6">
                <TitlePage
                    title="Đón / Trả học sinh"
                    icon={<StudentIcon className="text-green-700" size={30} />}
                    size="text-2xl"
                    color="text-gray-700"
                    className="mb-6"
                />

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto"
                >
                    {/* Nhập mã số học sinh */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Mã số học sinh
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={studentCode}
                                onChange={(e) => setStudentCode(e.target.value)}
                                placeholder="Nhập mã số học sinh..."
                                className="border rounded-lg px-3 py-2 flex-1 focus:ring focus:ring-green-200"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                Tìm
                            </button>
                        </div>
                    </div>

                    {/* Hiển thị kết quả */}
                    {loading ? (
                        <p className="text-center text-gray-500">Đang tìm...</p>
                    ) : message && !studentInfo ? (
                        <p className="text-center text-red-500">{message}</p>
                    ) : studentInfo ? (
                        <div className="mt-4 border-t pt-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Thông tin học sinh
                            </h3>
                            <p><strong>Mã số:</strong> {studentInfo.id}</p>
                            <p><strong>Họ tên:</strong> {studentInfo.name}</p>
                            <p><strong>Lớp:</strong> {studentInfo.class}</p>
                            <p><strong>Tuyến xe:</strong> {studentInfo.bus}</p>
                            <p>
                                <strong>Trạng thái hiện tại:</strong>{" "}
                                <span className="text-blue-600">{studentInfo.currentStatus}</span>
                            </p>

                            {/* Nút đón / trả */}
                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={() => handleAction("pickup")}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    ✅ Xác nhận đón
                                </button>
                                <button
                                    onClick={() => handleAction("drop")}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                                >
                                    🚗 Xác nhận trả
                                </button>
                            </div>

                            {message && (
                                <p className="mt-3 text-green-600 font-medium">{message}</p>
                            )}
                        </div>
                    ) : null}
                </motion.div>

                {/* Lịch sử đón/trả */}
                {history.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white mt-8 p-6 rounded-xl shadow-md max-w-2xl mx-auto"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">📜 Lịch sử đón / trả</h3>
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
