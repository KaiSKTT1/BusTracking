import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";
import Pagination from "../../components/table/Pagination";
import Tab from "../../components/tabs/Tab";
import { ICONS } from "../../config/ICONS";
import { DRIVER_TABS } from "../../config/DRIVER_TABS";
import TitlePage from "../../components/title_pages/TitlePage";

const Drivers = () => {
  //icons
  const AddressCardIcon = ICONS.Drivers;

  const [activeTab, setActiveTab] = useState("active");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  //State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
          <button className="text-blue-500 hover:text-blue-700">View</button>
        );
      default:
        return driver[key] || "-";
    }
  };

  const currentColumns = DRIVER_TABS[activeTab].columns;

  return (
    <>
      <div className="p-6">
        <TitlePage
          title="Guardians"
          icon={<AddressCardIcon className="text-orange-700" size={30} />}
          size="text-2xl"
          color="text-gray-700"
        />

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
      </div>
    </>
  );
};

export default Drivers;
