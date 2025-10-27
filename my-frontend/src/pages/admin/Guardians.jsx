import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import { formatDate } from "../../utils/dateFormat.jsx";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";
import Pagination from "../../components/table/Pagination";
import Tab from "../../components/tabs/Tab";
import Button from "../../components/button/Button";
import ButtonsAction from "../../components/buttonsAction/ButtonsAction";
import DetailModal from "../../components/DetailModal/DetailModal";
import EditModal from "../../components/EditModal/EditModal";
import CreateModal from "../../components/CreateModal/CreateModal";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { ICONS } from "../../config/ICONS";
import { GUARDIAN_TABS } from "../../config/GUARDIAN_TABS";
import TitlePage from "../../components/title_pages/TitlePage";

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

  // Modal states
  const [selectedGuardian, setSelectedGuardian] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchGuardians();
  }, [activeTab]);

  const fetchGuardians = async () => {
    setLoading(true);
    try {
      const response = await api.get("/guardians");
      console.log("📡 API Response:", response.data);
      
      // Backend trả về { message: 'ok', data: [...] }
      let guardianData = Array.isArray(response.data.data) 
        ? response.data.data 
        : Array.isArray(response.data)
        ? response.data
        : [];

      console.log("👥 Guardian Data:", guardianData);

      // Set status mặc định là "Active" vì DB không có cột status
      guardianData = guardianData.map(guardian => ({
        ...guardian,
        status: "Active"
      }));

      console.log("✅ Final Data:", guardianData);
      setData(guardianData);
    } catch (error) {
      console.error("❌ Error fetching guardians:", error);
      toast.error("Failed to load guardians");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Lọc dữ liệu - Thêm check để đảm bảo data là array
  const filteredData = Array.isArray(data)
    ? data.filter((guardian) =>
      Object.values(guardian).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    : [];

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
    setCurrentPage(1);
  };

  // Modal handlers
  const handleView = (guardian) => {
    setSelectedGuardian(guardian);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (guardian) => {
    setSelectedGuardian(guardian);
    setIsEditModalOpen(true);
  };

  const handleDelete = (guardian) => {
    setSelectedGuardian(guardian);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await api.put(`/guardians/${selectedGuardian.id}`, {
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
        // Không gửi password nếu không đổi
      });

      toast("Guardian updated successfully!", {
        icon: "📝",
        style: {
          background: "#fffbeb",
          color: "#92400e",
          border: "1px solid #fde68a",
        },
      });

      fetchGuardians();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating guardian:", error);
      toast.error("Failed to update guardian");
    }
  };

  const handleCreateGuardian = async (newGuardian) => {
    try {
      await api.post("/guardians", {
        name: newGuardian.name,
        email: newGuardian.email,
        phone: newGuardian.phone,
        password: newGuardian.password || "123456",
      });

      toast.success("Guardian created successfully!");
      fetchGuardians();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating guardian:", error);
      toast.error(error.response?.data?.message || "Failed to create guardian");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/guardians/${selectedGuardian.id}`);

      toast.error("Guardian deleted successfully!");
      fetchGuardians();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting guardian:", error);
      toast.error(error.response?.data?.message || "Failed to delete guardian");
    }
  };

  const renderCell = (guardian, key) => {
    switch (key) {
      case "status":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${guardian[key] === "Active"
              ? "bg-green-100 text-green-800"
              : guardian[key] === "Suspended"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
              }`}
          >
            {guardian[key]}
          </span>
        );
      case "created_at":
        return formatDate(guardian[key]) || "-";
      case "actions":
        return (
          <ButtonsAction
            item={guardian}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      default:
        return guardian[key] || "-";
    }
  };

  const currentColumns = GUARDIAN_TABS[activeTab].columns;

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <TitlePage
            title="Guardians"
            icon={<AddressCardIcon className="text-orange-700" size={30} />}
            size="text-2xl"
            color="text-gray-700"
          />
          <Button
            title="Add New Guardian"
            icon={<PlusIcon className="text-white" size={18} />}
            onClick={() => setIsCreateModalOpen(true)}
          />
        </div>

        <Tab
          tabs={GUARDIAN_TABS}
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

        {/* Modals */}
        <AnimatePresence>
          {isDetailModalOpen && (
            <DetailModal
              item={selectedGuardian}
              onClose={() => setIsDetailModalOpen(false)}
              onEdit={() => {
                setIsDetailModalOpen(false);
                setIsEditModalOpen(true);
              }}
            />
          )}

          {isEditModalOpen && (
            <EditModal
              item={selectedGuardian}
              onClose={() => setIsEditModalOpen(false)}
              onSave={handleSaveEdit}
            />
          )}

          {isCreateModalOpen && (
            <CreateModal
              onClose={() => setIsCreateModalOpen(false)}
              onSave={handleCreateGuardian}
              defaultRole="Parent"
              requirePassword={true}
            />
          )}

          {isDeleteModalOpen && (
            <DeleteModal
              item={selectedGuardian}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={confirmDelete}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Guardians;
