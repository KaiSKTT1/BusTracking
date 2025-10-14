import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";
import Pagination from "../../components/table/Pagination";
import Tab from "../../components/tabs/Tab";
import { ICONS } from "../../config/ICONS";
import Header from "../../components/header/Header";
import { DRIVER_TABS } from "../../config/DRIVER_TABS";
import TitlePage from "../../components/title_pages/TitlePage";
import Button from "../../components/button/Button";
import ButtonsAction from "../../components/buttonsAction/ButtonsAction";
import DetailModal from "../../components/DetailModal/DetailModal";
import EditModal from "../../components/EditModal/EditModal";

const Drivers = () => {

    //icons
    const AddressCardIcon = ICONS.Drivers;
    const PlusIcon = ICONS.plus;

    const [activeTab, setActiveTab] = useState("active");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    //State cho pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [modalType, setModalType] = useState(null); // null | 'view' | 'edit' | 'delete'
    const [selectedDriver, setSelectedDriver] = useState(null);

    useEffect(() => {
        fetchDrivers();
    }, [activeTab]);

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            // Tạm thời comment API call
            // const response = await fetch(`/api/students?status=${activeTab}`);
            // const result = await response.json();

            // Mock data để test
            const mockData = {
                active: [
                    {
                        id: 1,
                        name: "Nguyen Van A",
                        email: "a@example.com",
                        bus: "Bus 01",
                        status: "Active",
                        created: "2024-01-01",
                    },
                    {
                        id: 2,
                        name: "Tran Thi B",
                        email: "b@example.com",
                        bus: "Bus 02",
                        status: "Active",
                        created: "2024-01-05",
                    },
                    {
                        id: 3,
                        name: "Le Van C",
                        email: "c@example.com",
                        bus: "Bus 03",
                        status: "Active",
                        created: "2024-02-10",
                    },
                ],

                suspended: [
                    {
                        id: 4,
                        name: "Pham Thi D",
                        email: "d@example.com",
                        bus: "Bus 01",
                        status: "Suspended",
                        created: "2024-03-15",
                    },
                    {
                        id: 5,
                        name: "Nguyen Van E",
                        email: "e@example.com",
                        bus: "Bus 02",
                        status: "Suspended",
                        created: "2024-03-20",
                    },
                ],

                under_review: [
                    {
                        id: 6,
                        name: "Tran Thi F",
                        email: "f@example.com",
                        bus: "Bus 03",
                        status: "Under Review",
                        created: "2024-04-01",
                    },
                    {
                        id: 7,
                        name: "Le Van G",
                        email: "g@example.com",
                        bus: "Bus 04",
                        status: "Under Review",
                        created: "2024-04-10",
                    },
                ],
            };

            setData(mockData[activeTab] || []);
        } catch (error) {
            console.error("Error fetching drivers:", error);
            setData([]); // Set empty array nếu có lỗi
        } finally {
            setLoading(false);
        }
    };

    // Lọc dữ liệu
    const filteredData = data.filter((driver) =>
        Object.values(driver).some((val) =>
            String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1); // Reset về trang 1
    };

    const handleViewDriver = (driver) => {
        setSelectedDriver(driver);
        setModalType('view');
    };
    const handleEditDriver = (driver) => {
        setSelectedDriver(driver);
        setModalType('edit');
    };
    const handleDeleteDriver = (driver) => {
        setSelectedDriver(driver);
        setModalType('delete');
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedDriver(null);
    };

    const handleSaveEdit = (updatedData) => {
        console.log("Saving updated data:", updatedData);


        handleCloseModal();
    };

    const renderCell = (driver, key) => {
        switch (key) {
            case "status":
                return (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {driver[key]}
                    </span>
                );
            case "actions":
                return (
                    <div className="flex items-center gap-2">
                        <ButtonsAction
                            onView={handleViewDriver}
                            onEdit={handleEditDriver}
                            onDelete={handleDeleteDriver}
                            item={driver}
                        />
                    </div>
                );
            default:
                return driver[key] || "-";
        }
    };

    const currentColumns = DRIVER_TABS[activeTab].columns;

    return (
        <>
            <Header />
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <TitlePage
                        title="Guardians"
                        icon={<AddressCardIcon className="text-orange-700" size={30} />}
                        size="text-2xl"
                        color="text-gray-700"
                    />
                    <Button title="CREATE" icon={<PlusIcon className="text-white" />} />
                </div>

                <Tab tabs={DRIVER_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg shadow"
                    >
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />

                        <Table
                            loading={loading}
                            data={paginatedData}  //Dùng paginatedData thay vì filteredData
                            columns={currentColumns}
                            renderCell={renderCell}
                        />

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            rowsPerPage={rowsPerPage}
                            totalItems={filteredData.length}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
            <AnimatePresence>
                {modalType === 'view' && (
                    <DetailModal
                        item={selectedDriver}
                        editModal={handleEditDriver}
                        onClose={handleCloseModal}
                    />
                )}

                {modalType === 'edit' && (
                    <EditModal
                        item={selectedDriver}
                        onClose={handleCloseModal}
                        onSave={handleSaveEdit}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Drivers;