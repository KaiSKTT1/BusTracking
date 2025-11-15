import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ICONS } from "../../config/ICONS";
import Header from "../../components/header/Header";
import TitlePage from "../../components/title_pages/TitlePage";
import api from "../../utils/axios";

const PickupDropoff = () => {
  const [students, setStudents] = useState([]);
  const [history, setHistory] = useState([]);
  const StudentIcon = ICONS.Students;

  const currentDriverId = Number(localStorage.getItem("driverId")) || 3;

  useEffect(() => {
    loadPickups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lấy danh sách students theo student_ride -> timetable của driver
  const loadPickups = async () => {
    try {
      // lấy tất cả timetable của driver
      const tRes = await api.get("/timetable");
      const timetables = Array.isArray(tRes.data) ? tRes.data : Array.isArray(tRes.data?.data) ? tRes.data.data : [];
      const myTimetableIds = timetables.filter((t) => Number(t.driver_id) === currentDriverId).map((t) => t.timetable_id);

      if (myTimetableIds.length === 0) {
        setStudents([]);
        return;
      }

      const srRes = await api.get("/student_ride");
      const rides = Array.isArray(srRes.data) ? srRes.data : Array.isArray(srRes.data?.data) ? srRes.data.data : [];

      const studentIds = rides.filter((r) => myTimetableIds.includes(Number(r.timetable_id))).map((r) => r.student_id);

      // fetch students
      const stRes = await api.get("/student");
      const studentsAll = Array.isArray(stRes.data) ? stRes.data : Array.isArray(stRes.data?.data) ? stRes.data.data : [];

      const selectedStudents = studentsAll
        .filter((s) => studentIds.includes(Number(s.student_id)))
        .map((s, idx) => ({
          id: s.student_id ?? `S${idx + 1}`,
          name: s.name ?? s.username ?? "N/A",
          class: s.note ?? "N/A",
          bus: `Bus for timetable`,
          currentStatus: "Chưa đón",
        }));

      setStudents(selectedStudents);
    } catch (err) {
      console.error("Error loading pickup list:", err);
      // fallback demo
      setStudents([
        { id: "S001", name: "Nguyen Van A", class: "1A", bus: "Bus 01", currentStatus: "Chưa đón" },
        { id: "S002", name: "Tran Thi B", class: "2B", bus: "Bus 02", currentStatus: "Đã đón" },
      ]);
    }
  };

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

    const updated = students.map((s) => (s.id === id ? { ...s, currentStatus: type === "pickup" ? "Đã đón" : "Đã trả" } : s));
    setStudents(updated);

    const student = students.find((s) => s.id === id);
    const newRecord = {
      id: history.length + 1,
      name: student?.name ?? id,
      action: type === "pickup" ? "Đón học sinh" : "Trả học sinh",
      time: formattedTime,
    };
    setHistory([newRecord, ...history]);
  };

  return (
    <>
      <Header />
      <div className="p-6">
        <TitlePage title="Danh sách học sinh cần đón / trả" icon={<StudentIcon className="text-green-700" size={30} />} size="text-2xl" color="text-gray-700" className="mb-6" />

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border p-2">Mã học sinh</th>
                <th className="border p-2">Họ tên</th>
                <th className="border p-2">Lớp</th>
                <th className="border p-2">Tuyến xe</th>
                <th className="border p-2">Trạng thái</th>
                <th className="border p-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="text-center hover:bg-gray-50">
                  <td className="border p-2">{s.id}</td>
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.class}</td>
                  <td className="border p-2">{s.bus}</td>
                  <td className="border p-2">
                    <span className={`px-2 py-1 rounded-full text-white text-xs ${s.currentStatus === "Chưa đón" ? "bg-gray-500" : s.currentStatus === "Đã đón" ? "bg-blue-600" : "bg-green-600"}`}>{s.currentStatus}</span>
                  </td>
                  <td className="border p-2">
                    {s.currentStatus === "Chưa đón" && (
                      <button onClick={() => handleAction(s.id, "pickup")} className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition">✅ Đón</button>
                    )}
                    {s.currentStatus === "Đã đón" && (
                      <button onClick={() => handleAction(s.id, "drop")} className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition">🚗 Trả</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {history.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white mt-8 p-6 rounded-xl shadow-md max-w-3xl mx-auto">
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
