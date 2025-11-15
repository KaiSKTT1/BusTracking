import React, { useState, useEffect } from "react";
import TitlePage from "../../components/title_pages/TitlePage";
import Header from "../../components/header/Header";
import { ICONS } from "../../config/ICONS";
import { STUDENT_TABS } from "../../config/STUDENT_TABS";
import Button from "../../components/button/Button";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";
import "leaflet/dist/leaflet.css";
import MapView from "../../components/map/MapView";
import api from "../../utils/axios";

const Students = () => {
  const StudentIcon = ICONS.Students;
  const PlusIcon = ICONS.plus;

  const [activeTab, setActiveTab] = useState("active");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  const parentId = Number(localStorage.getItem("parentId")) || null;

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // lấy danh sách student từ backend (theo SQL dump: table `student`)
      const res = await api.get("/student");
      const students = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];

      // lọc theo phụ huynh (id_ph)
      const myStudents = parentId ? students.filter((s) => Number(s.id_ph) === Number(parentId)) : students;

      // map sang định dạng UI (id, name, note, lat/lng fallback)
      const mapped = myStudents.map((s, idx) => ({
        id: s.student_id ?? s.id ?? idx + 1,
        name: s.name ?? s.username ?? "-",
        age: s.age ?? "-", // nếu backend trả
        grade: s.note ?? "-", // dùng note field làm lớp/ghi chú
        status: activeTab === "active" ? "active" : "inactive",
        lat: s.lat ?? s.latitude ?? 10.776889,
        lng: s.lng ?? s.longitude ?? 106.700806,
        raw: s,
      }));

      setData(mapped);
    } catch (error) {
      console.error("Error fetching students:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, parentId]);

  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = data.slice(indexOfFirst, indexOfLast);

  const currentColumns = STUDENT_TABS[activeTab]?.columns ?? [];

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
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => {
              setSelectedStudent(student);
              setCurrentPosition({ lat: student.lat, lng: student.lng });
            }}
          >
            View
          </button>
        );
      default:
        return student[key] ?? "-";
    }
  };

  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setCurrentPosition({ lat: student.lat, lng: student.lng });
  };

  return (
    <>
      <Header />
      <div className="container p-6">
        <div className="flex items-center justify-between mb-4">
          <TitlePage
            title="Students"
            icon={<StudentIcon className="text-orange-700" size={30} />}
            size="text-2xl"
            color="text-gray-700"
          />
          <Button title="Add Student" icon={<PlusIcon />} />
        </div>

        <SearchBar />
        <Table
          loading={loading}
          data={currentData}
          columns={currentColumns}
          renderCell={renderCell}
          funct={handleRowClick}
        />

        <div className="flex justify-center mt-4 h-[400px]">
          {selectedStudent ? (
            <MapView position={[selectedStudent.lat, selectedStudent.lng]} currentPosition={currentPosition} />
          ) : (
            <MapView position={[10.776889, 106.700806]} currentPosition={currentPosition} />
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-gray-200 rounded mr-2"
            >
              Prev
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Page {currentPage} / {totalPages}
          </div>
        </div>
      </div>
    </>
  );
};
export default Students;