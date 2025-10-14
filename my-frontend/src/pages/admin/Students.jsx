import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";
import Pagination from "../../components/table/Pagination";
import Tab from "../../components/tabs/Tab";
import { STUDENT_TABS } from "../../config/STUDENT_TABS";
import { ICONS } from "../../config/ICONS";
import Header from "../../components/header/Header";
import TitlePage from "../../components/title_pages/TitlePage";
import DetailModal from "../../components/DetailModal/DetailModal";
import EditModal from "../../components/EditModal/EditModal";
import api from "../../utils/axios";
import ButtonsAction from "../../components/buttonsAction/ButtonsAction";

const Students = () => {
    const AddressCardIcon = ICONS.Students;


    const [activeTab, setActiveTab] = useState("active");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // ===== SỬA LẠI - Dùng modalType thay vì showModal =====
    const [modalType, setModalType] = useState(null); // null | 'view' | 'edit' | 'delete'
    const [selectedStudent, setSelectedStudent] = useState(null);
    // ====================================================

    useEffect(() => {
        fetchStudents();
    }, [activeTab]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await api.get("/students");
            console.log(res);
            setData(res.data || []);
        } catch (error) {
            console.error("Error fetching students:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    // ===== Các hàm xử lý modal =====
    const handleViewStudent = (student) => {
        setSelectedStudent(student);
        setModalType('view');  // Mở modal VIEW
    };

    const handleEditStudent = (student) => {
        setSelectedStudent(student);
        setModalType('edit');  // Mở modal EDIT
    };

    const handleDeleteStudent = (student) => {
        setSelectedStudent(student);
        setModalType('delete');  // Mở modal DELETE
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedStudent(null);
    };

    const handleSaveEdit = (updatedData) => {
        console.log("Saving updated data:", updatedData);
        // TODO: Call API để update
        // fetch(`/api/students/${selectedStudent.id}`, {
        //     method: 'PUT',
        //     body: JSON.stringify(updatedData)
        // })

        handleCloseModal();
    };
    // ================================

    const filteredData = data.filter((student) =>
        Object.values(student).some((val) =>
            String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

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
        setCurrentPage(1);
    };

    const renderCell = (student, key) => {
        switch (key) {
            case "status":
                return (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {student[key]}
                    </span>
                );
            case "actions":
                return (
                    <div className="flex items-center gap-2">

                        <ButtonsAction
                            onView={handleViewStudent}
                            onEdit={handleEditStudent}
                            onDelete={handleDeleteStudent}
                            item={student}
                        />

                    </div>
                );
            default:
                return student[key] || "-";
        }
    };

    const currentColumns = STUDENT_TABS[activeTab].columns;

    return (
        <>
            <Header />
            <div className="p-6">
                <TitlePage
                    title="Students"
                    icon={<AddressCardIcon className="text-orange-700" size={30} />}
                    size="text-2xl"
                    color="text-gray-700"
                />

                <Tab tabs={STUDENT_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

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
                            data={paginatedData}
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

            {/* ===== RENDER MODAL DỰA TRÊN modalType ===== */}
            <AnimatePresence>
                {/* Modal View - Chỉ hiện khi modalType === 'view' */}
                {modalType === 'view' && (
                    <DetailModal
                        item={selectedStudent}
                        editModal={handleEditStudent}
                        onClose={handleCloseModal}
                    />
                )}

                {/* Modal Edit - Chỉ hiện khi modalType === 'edit' */}
                {modalType === 'edit' && (
                    <EditModal
                        item={selectedStudent}
                        onClose={handleCloseModal}
                        onSave={handleSaveEdit}
                    />
                )}

                {/* Modal Delete - Chỉ hiện khi modalType === 'delete' */}
                {/* TODO: Tạo component ConfirmDeleteModal nếu cần */}
            </AnimatePresence>
        </>
    );
};

export default Students;