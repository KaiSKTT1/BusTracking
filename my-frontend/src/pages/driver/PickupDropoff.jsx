import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ICONS } from "../../config/ICONS";
import Header from "../../components/header/Header";
import TitlePage from "../../components/title_pages/TitlePage";
import api from "../../utils/axios";

const PickupDropoff = () => {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [busList, setBusList] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  // Popup báo cáo
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportType, setReportType] = useState(null);
  const [selectedTimetable, setSelectedTimetable] = useState(null);

  // Tình trạng từng học sinh (1 = đón, 2 = trả)
  const [studentStatus, setStudentStatus] = useState({});

  const StudentIcon = ICONS.Students;
  const currentDriverId = Number(localStorage.getItem("driverId")) || 3;

  // ================================
  //   LOAD BUS THEO NGÀY
  // ================================
  useEffect(() => {
    const loadBuses = async () => {
      try {
        const res = await api.get(
          `/timetable/driver/${currentDriverId}/date/${selectedDate}/buses`
        );

        const buses = res.data?.data || res.data;
        setBusList(buses);

        if (buses.length > 0) {
          setSelectedBus(buses[0].bus_id);
        } else {
          setSelectedBus(null);
        }
      } catch (err) {
        console.error("Error loading bus list:", err);
        setBusList([]);
        setSelectedBus(null);
      }
    };
    loadBuses();
  }, [selectedDate]);

  // ================================
  //   LOAD STUDENT THEO BUS + NGÀY
  // ================================
  useEffect(() => {
    if (!selectedBus) return;

    const loadStudents = async () => {
      try {
        const res = await api.get(
          `/timetable/driver/${currentDriverId}/bus/${selectedBus}/date/${selectedDate}/students`
        );

        const list = res.data?.data || res.data;

        // ❗ Lấy timetable_id từ API
        if (list.length > 0) {
          setSelectedTimetable(list[0].timetable_id);
        } else {
          setSelectedTimetable(null);
        }

        const studentData = list.map((s) => ({
          id: s.student_id,
          name: s.name,
          class: s.note || "N/A",
          bus: `Bus #${selectedBus}`,
          timetable_id: s.timetable_id, // lưu thêm để debug
        }));

        setStudents(studentData);
        setStudentStatus({}); // reset trạng thái
      } catch (err) {
        console.error("Error loading students:", err);
        setStudents([]);
        setSelectedTimetable(null);
      }
    };
    loadStudents();
  }, [selectedBus, selectedDate]);


  // ================================
  //   SUBMIT TẠO BÁO CÁO
  // ================================
  const submitReport = async () => {
    if (!reportType) return alert("Chọn loại báo cáo!");
    if (!selectedTimetable)
      return alert("Không tìm thấy timetable_id!");

    if (reportType === 1) {
      const details = Object.entries(studentStatus)
        .filter(([sid, status]) => status === 1 || status === 2)
        .map(([sid, status]) => ({
          student_id: Number(sid),
          tinh_trang: status === 1 ? "Đón" : "Trả",
        }));

      if (details.length === 0)
        return alert("Bạn phải chọn ít nhất 1 học sinh!");

      try {
        await api.post("/baocao/", {
          admin_id: 1,
          driver_id: currentDriverId,
          timetable_id: selectedTimetable,
          type: 1,
          details,
        });

        alert("Tạo báo cáo thành công!");
        setShowReportForm(false);
      } catch (err) {
        console.error(err);
        alert("Lỗi tạo báo cáo!");
      }
    } else {
      // Loại 2
      try {
        await api.post("/baocao/", {
          admin_id: 1,
          driver_id: currentDriverId,
          timetable_id: selectedTimetable,
          type: 2,
          details: [
            {
              student_id: null,
              tinh_trang: "Báo cáo khác",
            },
          ],
        });

        alert("Đã gửi báo cáo khác!");
        setShowReportForm(false);
      } catch (err) {
        console.error(err);
        alert("Lỗi tạo báo cáo!");
      }
    }
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

        {/* Chọn ngày + bus */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="text-gray-700 font-medium">Chọn ngày:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-2 py-1"
          />

          <label className="text-gray-700 font-medium">Chọn bus:</label>
          <select
            value={selectedBus || ""}
            onChange={(e) => setSelectedBus(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {busList.length === 0 && <option>Không có bus</option>}
            {busList.map((b) => (
              <option key={b.bus_id} value={b.bus_id}>
                {b.license} (Sức chứa: {b.capacity})
              </option>
            ))}
          </select>

          {/* Nút tạo báo cáo */}
          <button
            onClick={() => setShowReportForm(true)}
            className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            📝 Tạo báo cáo
          </button>
        </div>

        {/* Bảng học sinh */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto"
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border p-2">Mã học sinh</th>
                <th className="border p-2">Họ tên</th>
                <th className="border p-2">Lớp</th>
                <th className="border p-2">Tuyến xe</th>
                <th className="border p-2">Đón</th>
                <th className="border p-2">Trả</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="text-center hover:bg-gray-50">
                  <td className="border p-2">{s.id}</td>
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.class}</td>
                  <td className="border p-2">{s.bus}</td>

                  {/* Chọn đón */}
                  <td className="border p-2">
                    <input
                      type="radio"
                      name={`status_${s.id}`}
                      checked={studentStatus[s.id] === 1}
                      onChange={() =>
                        setStudentStatus({
                          ...studentStatus,
                          [s.id]: 1,
                        })
                      }
                    />
                  </td>

                  {/* Chọn trả */}
                  <td className="border p-2">
                    <input
                      type="radio"
                      name={`status_${s.id}`}
                      checked={studentStatus[s.id] === 2}
                      onChange={() =>
                        setStudentStatus({
                          ...studentStatus,
                          [s.id]: 2,
                        })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* =============================== */}
        {/*       POPUP tạo báo cáo        */}
        {/* =============================== */}
        {showReportForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-5 rounded-xl shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-3">Chọn loại báo cáo</h3>

              <div className="mb-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="reportType"
                    value={1}
                    onChange={() => setReportType(1)}
                  />
                  Báo cáo đón / trả học sinh
                </label>

                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="radio"
                    name="reportType"
                    value={2}
                    onChange={() => setReportType(2)}
                  />
                  Báo cáo khác
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                  onClick={() => setShowReportForm(false)}
                >
                  Hủy
                </button>
                <button
                  onClick={submitReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PickupDropoff;
