import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";
import Pagination from "../../components/table/Pagination";
import Tab from "../../components/tabs/Tab";
import { ICONS } from "../../config/ICONS";
import Header from "../../components/header/Header";
import { GUARDIAN_TABS } from "../../config/GUARDIAN_TABS";
import TitlePage from "../../components/title_pages/TitlePage";
import Button from "../../components/button/Button";
import api from "../../utils/axios";
import ButtonsAction from "../../components/buttonsAction/ButtonsAction";
import DetailModal from "../../components/DetailModal/DetailModal";
import EditModal from "../../components/EditModal/EditModal";
import CreateModal from "../../components/CreateModal/CreateModal";

const Guardians = () => {

    //icons
    const AddressCardIcon = ICONS.Guardians;
    const PlusIcon = ICONS.plus;

    const [activeTab, setActiveTab] = useState("active");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    //State cho pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [modalType, setModalType] = useState(null); // null | 'view' | 'edit' | 'delete' | 'create'
    const [selectedGuardian, setSelectedGuardian] = useState(null);

    useEffect(() => {
        fetchDrivers();
    }, [activeTab]);

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/users");
            // console.log(res);
            setData(res.data.data || []);

        } catch (error) {
            console.error("Error fetching drivers:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    // Lọc dữ liệu
    const filteredData = data.filter((guardian) =>
        Object.values(guardian).some((val) =>
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

    const handleViewGuardians = (guardian) => {
        setSelectedGuardian(guardian);
        setModalType('view');
    };

    const handleEditGuardians = (guardian) => {
        setSelectedGuardian(guardian);
        setModalType('edit');
    };

    const handleDeleteGuardians = (guardian) => {
        setSelectedGuardian(guardian);
        setModalType('delete');
    };

    const handleCreateGuardians = () => {
        setModalType('create');
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedGuardian(null);
    };

    const handleSaveEdit = (updatedData) => {
        console.log("Saving updated data:", updatedData);


        handleCloseModal();
    };

    const renderCell = (guardian, key) => {
        switch (key) {
            case "status":
                return (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {guardian[key]}
                    </span>
                );
            case "actions":
                return (
                    <div className="flex items-center gap-2">

                        <ButtonsAction
                            onView={handleViewGuardians}
                            onEdit={handleEditGuardians}
                            onDelete={handleDeleteGuardians}
                            item={guardian}
                        />

                    </div>
                );
            default:
                return guardian[key] || "-";
        }
    };

    const currentColumns = GUARDIAN_TABS[activeTab].columns;

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
                    <Button
                        title="CREATE"
                        icon={<PlusIcon className="text-white" />}
                        onClick={handleCreateGuardians}
                    />
                </div>
                <Tab tabs={GUARDIAN_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

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
                        item={selectedGuardian}
                        editModal={handleEditGuardians}
                        onClose={handleCloseModal}
                    />
                )}

                {modalType === 'edit' && (
                    <EditModal
                        item={selectedGuardian}
                        onClose={handleCloseModal}
                        onSave={handleSaveEdit}
                    />
                )}

                {modalType === 'create' && (
                    <CreateModal
                        defaultRole="Guardian"
                        onClose={handleCloseModal}
                        onSave={handleSaveEdit}
                    />
                )}


                {/* Modal Delete - Chỉ hiện khi modalType === 'delete' */}

            </AnimatePresence>
        </>
    );
};

export default Guardians;