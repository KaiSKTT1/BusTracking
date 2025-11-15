import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";
import { ICONS } from "../../config/ICONS";
import Header from "../../components/header/Header";
import TitlePage from "../../components/title_pages/TitlePage";
import api from "../../utils/axios";

const SCHEDULE_COLUMNS = [
  { key: "busName", label: "Xe Bus" },
  { key: "startPoint", label: "Điểm bắt đầu" },
  { key: "endPoint", label: "Điểm kết thúc" },
  { key: "runDate", label: "Ngày chạy" },
  { key: "actions", label: "Thao tác" },
];

const Report = () => {
  const BusIcon = ICONS.Buses;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [reportText, setReportText] = useState("");
  const [showModal, setShowModal] = useState(false);

  const currentDriverId = Number(localStorage.getItem("driverId")) || 3;

  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const tRes = await api.get("/timetable");
      const timetables = Array.isArray(tRes.data) ? tRes.data : Array.isArray(tRes.data?.data) ? tRes.data.data : [];

      // chỉ lấy lịch của driver
      const my = timetables.filter((tt) => Number(tt.driver_id) === Number(currentDriverId));

      // lấy bus và trip để show tên
      const [bRes, trRes] = await Promise.allSettled([api.get("/bus"), api.get("/trip")]);
      const buses = Array.isArray(bRes.value?.data) ? bRes.value.data : Array.isArray(bRes.value?.data?.data) ? bRes.value.data.data : [];
      const trips = Array.isArray(trRes.value?.data) ? trRes.value.data : Array.isArray(trRes.value?.data?.data) ? trRes.value.data.data : [];

      const busMap = new Map(buses.map((b) => [b.bus_id ?? b.id, b]));
      const tripMap = new Map(trips.map((t) => [t.trip_id ?? t.id, t]));

      const list = my.map((tt) => {
        const bus = busMap.get(tt.bus_id) || {};
        const trip = tripMap.get(tt.trip_id) || {};
        return {
          id: tt.timetable_id,
          busName: bus.license ?? `Bus ${tt.bus_id}`,
          startPoint: trip.route_id ? `Route ${trip.route_id}` : "N/A",
          endPoint: trip.route_id ? `Route ${trip.route_id}` : "N/A",
          runDate: tt.planned_date ?? "-",
          raw: { tt, trip, bus },
        };
      });

      setData(list);
    } catch (err) {
      console.error("Error loading schedules for report:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data
    .filter((s) =>
      Object.values(s).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  const handleSendReport = async () => {
    if (!reportText.trim()) {
      alert("Vui lòng nhập nội dung sự cố trước khi gửi!");
      return;
    }

    if (!selectedSchedule) {
      alert("Chọn lịch trước khi gửi báo cáo.");
      return;
    }

    try {
      // Thử tạo báo cáo ở endpoint /baocao (theo SQL dump)
      const payload = {
        admin_id: null,
        driver_id: Number(currentDriverId),
        date: new Date().toISOString().split("T")[0],
      };

      const createRes = await api.post("/baocao", payload).catch((e) => {
        // nếu backend khác, thử /reports
        return api.post("/reports", payload).catch(() => null);
      });

      // nếu có success, có thể tạo chi tiết báo cáo (chitietbaocao)
      if (createRes && createRes.data) {
        const baoCaoId = createRes.data.bao_cao_id ?? createRes.data.id ?? null;
        if (baoCaoId) {
          await api.post("/chitietbaocao", {
            bao_cao_id: baoCaoId,
            student_id: null,
            tinh_trang: reportText,
          }).catch(() => {});
        }
      }

      alert("✅ Gửi thông báo thành công!");
      setShowModal(false);
      setReportText("");
    } catch (err) {
      console.error("Error sending report:", err);
      alert("Gửi thất bại, kiểm tra kết nối tới backend.");
    }
  };

  const renderCell = (schedule, key) => {
    switch (key) {
      case "actions":
        return (
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => {
              setSelectedSchedule(schedule);
              setShowModal(true);
            }}
          >
            Gửi thông báo
          </button>
        );
      default:
        return schedule[key] || "-";
    }
  };

  return (
    <>
      <Header />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <TitlePage
            title="Báo cáo / Thông báo sự cố"
            icon={<BusIcon className="text-orange-700" size={30} />}
            size="text-2xl"
            color="text-gray-700"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key="driver-report" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="bg-white rounded-lg shadow">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <Table loading={loading} data={filteredData} columns={SCHEDULE_COLUMNS} renderCell={renderCell} />
          </motion.div>
        </AnimatePresence>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Gửi thông báo sự cố</h2>
            <p className="text-sm text-gray-600 mb-2">
              Tuyến: <strong>{selectedSchedule?.busName}</strong> <br />
              Ngày chạy: {selectedSchedule?.runDate}
            </p>

            <textarea rows="4" className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập mô tả sự cố..." value={reportText} onChange={(e) => setReportText(e.target.value)}></textarea>

            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Hủy</button>
              <button onClick={handleSendReport} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Gửi</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Report;
