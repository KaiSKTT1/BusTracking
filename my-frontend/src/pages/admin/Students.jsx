import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";
import Pagination from "../../components/table/Pagination";
import Tab from "../../components/tabs/Tab";
import Button from "../../components/button/Button";
import { STUDENT_TABS } from "../../config/STUDENT_TABS";
import { ICONS } from "../../config/ICONS";
import TitlePage from "../../components/title_pages/TitlePage";
import DetailModal from "../../components/DetailModal/DetailModal";
import EditModal from "../../components/EditModal/EditModal";
import CreateModal from "../../components/CreateModal/CreateModal";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import ButtonsAction from "../../components/buttonsAction/ButtonsAction";
import api from "../../utils/axios";
import { formatDate } from "../../utils/dateFormat.jsx";
import toast from "react-hot-toast";

const Students = () => {
  //icons
  const AddressCardIcon = ICONS.Students;
  const PlusIcon = ICONS.plus;

  const [activeTab, setActiveTab] = useState("active");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  //State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State cho modals/actions
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [activeTab]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get("/students");
      const raw = Array.isArray(response.data) ? response.data : (Array.isArray(response.data?.data) ? response.data.data : []);
      console.log("Students data:", raw);

      const transformedData = raw.map((s) => ({
        id: s.student_id ?? s.id,
        name: s.name ?? s.username ?? "",
        address: s.note ?? "N/A",            // note in DB used as address/extra
        parent_id: s.id_ph ?? s.parent_id ?? null,
        parentName: s.parent_name ?? "N/A",
        parentEmail: s.parent_email ?? "N/A",
        parentPhone: s.parent_phone ?? "N/A",
        morningBus: s.morning_bus ?? "Bus 01",
        afternoonBus: s.afternoon_bus ?? "Bus 01",
        status: s.status ?? "Active",
        created: s.created_at ?? s.created ?? null,
        actions: ""
      }));

      setData(transformedData);
    } catch (error) {
      console.error("Error fetching students:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Lọc dữ liệu
  const filteredData = data.filter((student) =>
    Object.values(student).some((val) =>
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

  // Handler functions for actions
  const handleView = (student) => {
    console.log("View clicked:", student);
    setSelectedStudent(student);  // ← Không cần transform nữa!
    setShowViewModal(true);
  };

  const handleEdit = (student) => {
    console.log("Edit clicked:", student);
    setSelectedStudent(student);  // ← Không cần transform nữa!
    setShowEditModal(true);
  };

  const handleDelete = (student) => {
    console.log("Delete clicked:", student);
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await api.put(`/students/${selectedStudent.id}`, {
        name: updatedData.name,
        note: updatedData.address,       // note column in DB
        id_ph: selectedStudent.parent_id // parent id column in DB
      });
      fetchStudents();
      setShowEditModal(false);
      setSelectedStudent(null);
      toast("Student updated successfully!", { icon: "✏️" });
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Failed to update student!");
    }
  };

  const handleCreateStudent = async (newStudent) => {
    try {
      await api.post("/students", {
        name: newStudent.name,
        note: newStudent.address ?? newStudent.email ?? null,
        id_ph: null,
        school_id: newStudent.school_id ?? 1
      });
      fetchStudents();
      setShowCreateModal(false);
      toast.success("Student created successfully!");
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error("Failed to create student!");
    }
  };

  const confirmDelete = async (student) => {
    try {
      await api.delete(`/students/${student.id}`);
      fetchStudents();
      setShowDeleteModal(false);
      setSelectedStudent(null);
      toast.error("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student!");
    }
  };

  const renderCell = (student, key) => {
    switch (key) {
      case "status":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            {student[key]}
          </span>
        );
      case "created":
        return formatDate(student[key]) || "-";
      case "actions":
        return (
          <ButtonsAction
            item={student}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      default:
        return student[key] || "-";
    }
  };

  const currentColumns = STUDENT_TABS[activeTab].columns;

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <TitlePage
            title="Students"
            icon={<AddressCardIcon className="text-orange-700" size={30} />}
            size="text-2xl"
            color="text-gray-700"
          />
          <Button
            title="Add New Student"
            icon={<PlusIcon className="text-white" size={18} />}
            onClick={() => setShowCreateModal(true)}
          />
        </div>

        <Tab
          tabs={STUDENT_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

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
              data={paginatedData} //Dùng paginatedData thay vì filteredData
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

        {/* View Modal - using DetailModal */}
        <AnimatePresence>
          {showViewModal && selectedStudent && (
            <DetailModal
              item={selectedStudent}
              onClose={() => setShowViewModal(false)}
              editModal={(student) => {
                setShowViewModal(false);
                handleEdit(student);
              }}
            />
          )}
        </AnimatePresence>

        {/* Edit Modal - using EditModal */}
        <AnimatePresence>
          {showEditModal && selectedStudent && (
            <EditModal
              item={selectedStudent}
              onClose={() => setShowEditModal(false)}
              onSave={handleSaveEdit}
            />
          )}
        </AnimatePresence>

        {/* Create Modal - using CreateModal */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateModal
              onClose={() => setShowCreateModal(false)}
              onSave={handleCreateStudent}
              defaultRole="Student"
              requirePassword={false}
            />
          )}
        </AnimatePresence>

        {/* Delete Modal - using DeleteModal */}
        <AnimatePresence>
          {showDeleteModal && selectedStudent && (
            <DeleteModal
              item={selectedStudent}
              onClose={() => setShowDeleteModal(false)}
              onConfirm={confirmDelete}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Students;
