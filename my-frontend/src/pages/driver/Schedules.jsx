import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";
import Pagination from "../../components/table/Pagination";
import { ICONS } from "../../config/ICONS";
import Header from "../../components/header/Header";
import TitlePage from "../../components/title_pages/TitlePage";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

const SCHEDULE_COLUMNS = [
  { key: "busName", label: "Xe Bus" },
  { key: "startPoint", label: "Điểm bắt đầu" },
  { key: "endPoint", label: "Điểm kết thúc" },
  { key: "runDate", label: "Ngày chạy" },
  { key: "actions", label: "Thao tác" },
];

const ScheduleViewer = () => {
  const BusIcon = ICONS.Buses;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const navigate = useNavigate();

  // lấy driverId từ localStorage (đặt khi login)
  const currentDriverId = Number(localStorage.getItem("driverId")) || 3;

  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lấy timetable + bổ sung thông tin bus, trip, route nếu cần
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const [tRes, busesRes, tripsRes, routesRes] = await Promise.allSettled([
        api.get("/timetable"),
        api.get("/bus"),
        api.get("/trip"),
        api.get("/route"),
      ]);

      const timetables = Array.isArray(tRes.value?.data)
        ? tRes.value.data
        : Array.isArray(tRes.value?.data?.data)
        ? tRes.value.data.data
        : [];

      const buses = Array.isArray(busesRes.value?.data)
        ? busesRes.value.data
        : Array.isArray(busesRes.value?.data?.data)
        ? busesRes.value.data.data
        : [];

      const trips = Array.isArray(tripsRes.value?.data)
        ? tripsRes.value.data
        : Array.isArray(tripsRes.value?.data?.data)
        ? tripsRes.value.data.data
        : [];

      const routes = Array.isArray(routesRes.value?.data)
        ? routesRes.value.data
        : Array.isArray(routesRes.value?.data?.data)
        ? routesRes.value.data.data
        : [];

      const busMap = new Map(buses.map((b) => [b.bus_id ?? b.id, b]));
      const tripMap = new Map(trips.map((t) => [t.trip_id ?? t.id, t]));
      const routeMap = new Map(routes.map((r) => [r.route_id ?? r.id, r]));

      // lọc theo driver và map fields để UI dùng
      const list = (timetables || [])
        .filter((tt) => Number(tt.driver_id) === Number(currentDriverId))
        .map((tt) => {
          const trip = tripMap.get(tt.trip_id) || {};
          const route = routeMap.get(trip.route_id) || {};
          const bus = busMap.get(tt.bus_id) || {};
          return {
            id: tt.timetable_id ?? tt.id,
            busName: bus.license ?? `Bus ${tt.bus_id ?? "-"}`,
            driverId: tt.driver_id,
            driverName: "", // nếu cần, backend user lookup có thể bổ sung
            startPoint: route.name ? `${route.name} (start)` : "N/A",
            endPoint: route.name ? `${route.name} (end)` : "N/A",
            runDate: tt.planned_date ?? tt.plannedDate ?? "-",
            raw: { tt, trip, route, bus },
          };
        });

      setData(list.length ? list : []); // fallback empty
    } catch (error) {
      console.error("Error fetching schedules:", error);
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

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const renderCell = (schedule, key) => {
    switch (key) {
      case "actions":
        return (
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => navigate(`/driver/schedule/${schedule.id}`)}
          >
            Xem chi tiết
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
            title="Lịch trình của tôi"
            icon={<BusIcon className="text-orange-700" size={30} />}
            size="text-2xl"
            color="text-gray-700"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key="driver-schedule"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow"
          >
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <Table loading={loading} data={paginatedData} columns={SCHEDULE_COLUMNS} renderCell={renderCell} />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              totalItems={filteredData.length}
              onPrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default ScheduleViewer;
