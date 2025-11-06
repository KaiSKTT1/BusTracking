import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";
import Pagination from "../../components/table/Pagination";
import { ICONS } from "../../config/ICONS";
import Header from "../../components/header/Header";
import TitlePage from "../../components/title_pages/TitlePage";
import { useNavigate } from "react-router-dom";


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

const ScheduleViewer = () => {
    const BusIcon = ICONS.Buses;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();


    const currentDriverId = 3; // 👈 tài xế đang đăng nhập

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

    // 🔍 Lọc theo tài xế đang đăng nhập + từ khóa
    const filteredData = data
        .filter((s) => s.driverId === currentDriverId)
        .filter((s) =>
            Object.values(s).some((val) =>
                String(val).toLowerCase().includes(searchQuery.toLowerCase())
            )
        );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

    const renderCell = (schedule, key) => {
        switch (key) {
            case "actions":
                return (
                    <button className="text-blue-500 hover:text-blue-700"
                        onClick={() => navigate(`/school/${schedule.id}`)} // 👈 điều hướng
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
                        <Table
                            loading={loading}
                            data={paginatedData}
                            columns={SCHEDULE_COLUMNS}
                            renderCell={renderCell}
                        />
                        {/* <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            rowsPerPage={rowsPerPage}
                            totalItems={filteredData.length}
                            onPrevious={() =>
                                setCurrentPage((p) => Math.max(p - 1, 1))
                            }
                            onNext={() =>
                                setCurrentPage((p) => Math.min(p + 1, totalPages))
                            }
                        /> */}
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    );
};

export default ScheduleViewer;
