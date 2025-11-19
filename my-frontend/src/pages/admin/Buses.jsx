import React, { useState, useEffect } from "react";
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
import DetailBusModal from "../../components/DetailModal/DetailBusModal";
import EditBusModal from "../../components/EditModal/EditBusModal";
import CreateBusModal from "../../components/CreateModal/CreateBusModal";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { ICONS } from "../../config/ICONS";
import { BUSES_TABS } from "../../config/BUSES_TABS";
import TitlePage from "../../components/title_pages/TitlePage";

const Buses = () => {
  const BusIcon = ICONS.Buses;
  const PlusIcon = ICONS.plus;

  const [activeTab, setActiveTab] = useState("all");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedBus, setSelectedBus] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchBuses();
  }, [activeTab]);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/buses");
      let busData = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];

      // Transform DB schema: bus_id -> id, license -> license_plate, capacity -> seats
      busData = busData.map((bus) => ({
        id: bus.bus_id ?? bus.id,
        license_plate: bus.license ?? bus.license_plate ?? "-",
        seats: bus.capacity ?? bus.seats ?? null,
        driver_id: bus.driver_id ?? bus.assigned_driver_id ?? null, // if present
        created_at: bus.created_at ?? bus.created ?? null,
        // keep raw fields for debugging
        raw: bus,
      }));

      // assign status: if driver_id present -> Active else Available
      busData = busData.map((b) => ({ ...b, status: b.driver_id ? "Active" : "Available" }));

      setData(busData);
    } catch (error) {
      console.error("Error fetching buses:", error);
      toast.error("Failed to fetch buses");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = Array.isArray(data)
    ? data.filter((bus) => Object.values(bus).some((val) => String(val).toLowerCase().includes(searchQuery.toLowerCase())))
    : [];

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

  const handleView = (bus) => {
    setSelectedBus(bus);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (bus) => {
    setSelectedBus(bus);
    setIsEditModalOpen(true);
  };

  const handleDelete = (bus) => {
    setSelectedBus(bus);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await api.put(`/buses/${selectedBus.id}`, {
        license: updatedData.license_plate,
        capacity: updatedData.seats,
        driver_id: updatedData.driver_id || null,
      });

      toast("Bus updated successfully!", { icon: "📝" });
      fetchBuses();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating bus:", error);
      toast.error(error.response?.data?.message || "Failed to update bus");
    }
  };

  const handleCreateBus = async (newBus) => {
    try {
      await api.post("/buses", {
        license: newBus.license_plate,
        capacity: newBus.seats,
        driver_id: newBus.driver_id || null,
      });

      toast.success("Bus created successfully!");
      fetchBuses();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating bus:", error);
      toast.error(error.response?.data?.message || "Failed to create bus");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/buses/${selectedBus.id}`);
      toast.error("Bus deleted successfully!");
      fetchBuses();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting bus:", error);
      toast.error(error.response?.data?.message || "Failed to delete bus");
    }
  };

  const renderCell = (bus, key) => {
    switch (key) {
      case "status":
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${bus[key] === "Active" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>{bus[key]}</span>;
      case "driver_name":
        return bus[key] || <span className="text-gray-400 italic">Unassigned</span>;
      case "created_at":
        return formatDate(bus[key]) || "-";
      case "actions":
        return <ButtonsAction item={bus} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />;
      default:
        return bus[key] ?? "-";
    }
  };

  const currentColumns = BUSES_TABS[activeTab].columns;

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <TitlePage title="Buses" icon={<BusIcon className="text-orange-700" size={30} />} size="text-2xl" color="text-gray-700" />
          <Button title="Add New Bus" icon={<PlusIcon className="text-white" size={18} />} onClick={() => setIsCreateModalOpen(true)} />
        </div>

        <Tab tabs={BUSES_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="bg-white rounded-lg shadow">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            <Table loading={loading} data={paginatedData} columns={currentColumns} renderCell={renderCell} />

            <Pagination currentPage={currentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} totalItems={filteredData.length} onRowsPerPageChange={handleRowsPerPageChange} onPrevious={handlePrevious} onNext={handleNext} />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {isDetailModalOpen && <DetailBusModal item={selectedBus} onClose={() => setIsDetailModalOpen(false)} editModal={(bus) => { setIsDetailModalOpen(false); setIsEditModalOpen(true); }} />}
          {isEditModalOpen && <EditBusModal item={selectedBus} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveEdit} />}
          {isCreateModalOpen && <CreateBusModal onClose={() => setIsCreateModalOpen(false)} onSave={handleCreateBus} />}
          {isDeleteModalOpen && <DeleteModal item={selectedBus} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} />}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Buses;
