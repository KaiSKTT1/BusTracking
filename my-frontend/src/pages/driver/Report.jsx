import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";
import { ICONS } from "../../config/ICONS";
import Header from "../../components/header/Header";
import TitlePage from "../../components/title_pages/TitlePage";

const mockSchedules = [
    {
        id: 1,
        busName: "Bus 01",
        driverId: 3,
        driverName: "Nguyễn Văn A",
        startPoint: "Bến xe miền Đông",
        endPoint: "ĐHQG",
        runDate: "2025-10-15",
    },
    {
        id: 2,
        busName: "Bus 02",
        driverId: 5,
        driverName: "Trần Văn B",
        startPoint: "Bến xe miền Tây",
        endPoint: "Bến Thành",
        runDate: "2025-10-16",
    },
];

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

    const currentDriverId = 3; // tài xế đang đăng nhập

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            setData(mockSchedules);
        } catch (error) {
            console.error(error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = data
        .filter((s) => s.driverId === currentDriverId)
        .filter((s) =>
            Object.values(s).some((val) =>
                String(val).toLowerCase().includes(searchQuery.toLowerCase())
            )
        );

    // Xử lý gửi thông báo
    const handleSendReport = () => {
        if (!reportText.trim()) {
            alert("Vui lòng nhập nội dung sự cố trước khi gửi!");
            return;
        }

        console.log("🚨 Gửi thông báo:", {
            scheduleId: selectedSchedule?.id,
            message: reportText,
        });

        alert("✅ Gửi thông báo thành công!");
        setShowModal(false);
        setReportText("");
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
                        <Table
                            loading={loading}
                            data={filteredData}
                            columns={SCHEDULE_COLUMNS}
                            renderCell={renderCell}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* MODAL NHẬP NỘI DUNG SỰ CỐ */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Gửi thông báo sự cố
                        </h2>
                        <p className="text-sm text-gray-600 mb-2">
                            Tuyến: <strong>{selectedSchedule.busName}</strong> <br />
                            Ngày chạy: {selectedSchedule.runDate}
                        </p>

                        <textarea
                            rows="4"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập mô tả sự cố..."
                            value={reportText}
                            onChange={(e) => setReportText(e.target.value)}
                        ></textarea>

                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSendReport}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Gửi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Report;
