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
import { DRIVER_TABS } from "../../config/DRIVER_TABS";
import TitlePage from "../../components/title_pages/TitlePage";

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

  // Modal states
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, [activeTab]);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/drivers');
      const raw = Array.isArray(response.data) ? response.data : (Array.isArray(response.data?.data) ? response.data.data : []);
      console.log("Driver Data:", raw);

      const driverData = raw.map(d => ({
        id: d.user_id ?? d.id,
        name: d.username ?? d.name ?? "",
        email: d.email ?? "N/A",
        phone: d.phone ?? "N/A",
        status: d.status ?? "Active",
        created_at: d.created_at ?? d.created ?? null
      }));

      setData(driverData);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Failed to fetch drivers");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Lọc dữ liệu - Thêm check để đảm bảo data là array
  const filteredData = Array.isArray(data)
    ? data.filter((driver) =>
      Object.values(driver).some((val) =>
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
  const handleView = (driver) => {
    setSelectedDriver(driver);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (driver) => {
    setSelectedDriver(driver);
    setIsEditModalOpen(true);
  };

  const handleDelete = (driver) => {
    setSelectedDriver(driver);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await api.put(`/drivers/${selectedDriver.id}`, {
        username: updatedData.name,
        email: updatedData.email
      });

      toast("Driver updated successfully!", { icon: "📝" });
      fetchDrivers();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating driver:", error);
      toast.error("Failed to update driver");
    }
  };

  const handleCreateDriver = async (newDriver) => {
    try {
      await api.post("/drivers", {
        username: newDriver.name,
        email: newDriver.email,
        password: newDriver.password || "123456",
        role_id: 2
      });

      toast.success("Driver created successfully!");
      fetchDrivers();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating driver:", error);
      toast.error(error.response?.data?.message || "Failed to create driver");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/drivers/${selectedDriver.id}`);
      toast.error("Driver deleted successfully!");
      fetchDrivers();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast.error(error.response?.data?.message || "Failed to delete driver");
    }
  };

  const renderCell = (driver, key) => {
    switch (key) {
      case "status":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${driver[key] === "Active"
              ? "bg-green-100 text-green-800"
              : driver[key] === "Suspended"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
              }`}
          >
            {driver[key]}
          </span>
        );
      case "created_at":
        return formatDate(driver[key]) || "-";
      case "actions":
        return (
          <ButtonsAction
            item={driver}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      default:
        return driver[key] || "-";
    }
  };

  const currentColumns = DRIVER_TABS[activeTab].columns;

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <TitlePage
            title="Drivers"
            icon={<AddressCardIcon className="text-orange-700" size={30} />}
            size="text-2xl"
            color="text-gray-700"
          />
          <Button
            title="Add New Driver"
            icon={<PlusIcon className="text-white" size={18} />}
            onClick={() => setIsCreateModalOpen(true)}
          />
        </div>

        <Tab
          tabs={DRIVER_TABS}
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

        {/* Modals */}
        <AnimatePresence>
          {isDetailModalOpen && (
            <DetailModal
              item={selectedDriver}
              onClose={() => setIsDetailModalOpen(false)}
              editModal={(driver) => {
                setIsDetailModalOpen(false);
                setIsEditModalOpen(true);
              }}
            />
          )}

          {isEditModalOpen && (
            <EditModal
              item={selectedDriver}
              onClose={() => setIsEditModalOpen(false)}
              onSave={handleSaveEdit}
            />
          )}

          {isCreateModalOpen && (
            <CreateModal
              onClose={() => setIsCreateModalOpen(false)}
              onSave={handleCreateDriver}
              defaultRole="Driver"
              requirePassword={true}
            />
          )}

          {isDeleteModalOpen && (
            <DeleteModal
              item={selectedDriver}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={confirmDelete}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Drivers;
