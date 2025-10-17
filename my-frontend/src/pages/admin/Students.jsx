import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";
import Pagination from "../../components/table/Pagination";
import Tab from "../../components/tabs/Tab";
import { STUDENT_TABS } from "../../config/STUDENT_TABS";
import { ICONS } from "../../config/ICONS";
import TitlePage from "../../components/title_pages/TitlePage";

const Students = () => {
  //icons
  const AddressCardIcon = ICONS.Students;

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
            created: "2024-01-02",
          },
        ],
        suspended: [
          {
            id: 3,
            name: "Le Van C",
            email: "c@example.com",
            reason: "Late payment",
            suspended_until: "2024-12-31",
          },
        ],
        under_review: [
          {
            id: 4,
            name: "Pham Thi D",
            email: "d@example.com",
            submitted_date: "2024-10-01",
            documents: "Pending",
          },
        ],
        out_of_coins: [
          {
            id: 5,
            name: "Pham Thi E",
            email: "e@example.com",
            submitted_date: "2024-10-01",
            documents: "Pending",
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
          <button className="text-blue-500 hover:text-blue-700">View</button>
        );
      default:
        return student[key] || "-";
    }
  };

  const currentColumns = STUDENT_TABS[activeTab].columns;

  return (
    <>
      <div className="p-6">
        <TitlePage
          title="Students"
          icon={<AddressCardIcon className="text-orange-700" size={30} />}
          size="text-2xl"
          color="text-gray-700"
          className="mb-6"
        />

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
      </div>
    </>
  );
};

export default Students;
