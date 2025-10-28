import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ICONS } from "../../config/ICONS";
import Header from "../../components/header/Header";
import TitlePage from "../../components/title_pages/TitlePage";
import {
    notifyPickedUp,
    notifyNotPickedUp,
    notifyIncident,
} from "../../redux/apiRequest";

const PickupDropoff = () => {
    const [students, setStudents] = useState([]);
    const [history, setHistory] = useState([]);

    const StudentIcon = ICONS.Students;
    const driver = JSON.parse(localStorage.getItem("user"));
    const busId = 1; // giả sử tài xế đang điều khiển bus_id = 1

    // 🔹 Mock danh sách học sinh
    useEffect(() => {
        setStudents([
            {
                student_id: 1,
                name: "Nguyễn Văn An",
                school_id: 1,
                note: "Lớp 5A",
                id_ph: 5,
                bus_id: 1,
                currentStatus: "Chưa đón",
            },
            {
                student_id: 2,
                name: "Trần Thị Bình",
                school_id: 1,
                note: "Lớp 4B",
                id_ph: 5,
                bus_id: 1,
                currentStatus: "Đã đón",
            },
            {
                student_id: 3,
                name: "Lê Hoàng Cường",
                school_id: 2,
                note: "Lớp 7A",
                id_ph: 6,
                bus_id: 2,
                currentStatus: "Chưa đón",
            },
            {
                student_id: 4,
                name: "Phạm Gia Huy",
                school_id: 2,
                note: "Lớp 8B",
                id_ph: 6,
                bus_id: null,
                currentStatus: "Chưa đón",
            },
            {
                student_id: 5,
                name: "Vũ Minh Anh",
                school_id: 1,
                note: "Lớp 5C",
                id_ph: 5,
                bus_id: null,
                currentStatus: "Chưa đón",
            },
        ]);
    }, [busId]);

    // 🔹 Xử lý khi tài xế nhấn "Đón" hoặc "Trả"
    const handleAction = async (studentId, type) => {
        const student = students.find((s) => s.student_id === studentId);
        if (!student) return;

        const now = new Date();
        const formattedTime = now.toLocaleString("vi-VN");

        try {
            let res = null;

            if (type === "pickup") {
                res = await notifyPickedUp(driver.user_id, studentId, busId);

                if (res?.message === "already_picked_up_today") {
                    alert("⚠️ Học sinh này đã được đón hôm nay rồi!");
                    return;
                } else if (res?.message === "success") {
                    alert("✅ Đã gửi thông báo đón thành công!");
                } else {
                    alert("❌ Gửi thông báo thất bại!");
                    return;
                }
            } else if (type === "drop") {
                res = await notifyNotPickedUp(
                    driver.user_id,
                    studentId,
                    busId,
                    "Đã trả học sinh về trường"
                );

                if (res?.message === "success") {
                    alert("✅ Đã gửi thông báo trả học sinh!");
                } else {
                    alert("❌ Gửi thông báo thất bại!");
                    return;
                }
            }

            // ✅ Nếu thông báo gửi thành công, cập nhật UI
            const updated = students.map((s) =>
                s.student_id === studentId
                    ? { ...s, currentStatus: type === "pickup" ? "Đã đón" : "Đã trả" }
                    : s
            );
            setStudents(updated);

            // ✅ Ghi lại lịch sử
            const newRecord = {
                id: history.length + 1,
                name: student.name,
                action: type === "pickup" ? "Đón học sinh" : "Trả học sinh",
                time: formattedTime,
            };
            setHistory([newRecord, ...history]);
        } catch (err) {
            console.error("🚫 Lỗi khi gửi thông báo:", err);
            alert("Không thể gửi thông báo!");
        }
    };

    // 🚨 Gửi thông báo sự cố
    const handleIncident = async () => {
        const message = prompt("Nhập mô tả sự cố:");
        if (!message) return;
        try {
            const res = await notifyIncident(driver.user_id, busId, message);
            if (res?.message === "success") {
                alert("🚨 Đã gửi thông báo sự cố!");
            } else {
                alert("❌ Gửi thông báo sự cố thất bại!");
            }
        } catch (err) {
            console.error("❌ Lỗi khi gửi sự cố:", err);
        }
    };

    return (
        <>
            <Header />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <TitlePage
                        title="Danh sách học sinh cần đón / trả"
                        icon={<StudentIcon className="text-green-700" size={28} />}
                        size="text-2xl"
                        color="text-gray-700"
                    />
                    <button
                        onClick={handleIncident}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        🚨 Báo sự cố
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-xl shadow-md w-full max-w-4xl mx-auto"
                >
                    <table className="min-w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="border p-2">Mã HS</th>
                                <th className="border p-2">Họ tên</th>
                                <th className="border p-2">Lớp</th>
                                <th className="border p-2">Trạng thái</th>
                                <th className="border p-2">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students
                                .filter((s) => s.bus_id === busId)
                                .map((s) => (
                                    <tr key={s.student_id} className="text-center hover:bg-gray-50">
                                        <td className="border p-2">{s.student_id}</td>
                                        <td className="border p-2">{s.name}</td>
                                        <td className="border p-2">{s.note}</td>
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
                                                    onClick={() =>
                                                        handleAction(s.student_id, "pickup")
                                                    }
                                                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-blue-700"
                                                >
                                                    ✅ Đón
                                                </button>
                                            )}
                                            {s.currentStatus === "Đã đón" && (
                                                <button
                                                    onClick={() =>
                                                        handleAction(s.student_id, "drop")
                                                    }
                                                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-yellow-600"
                                                >
                                                    🚗 Trả
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </motion.div>

                {/* 📜 Lịch sử */}
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
