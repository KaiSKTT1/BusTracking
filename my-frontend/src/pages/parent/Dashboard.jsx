import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import api from "../../utils/axios.jsx";
import TitlePage from "../../components/title_pages/TitlePage";
import Header from "../../components/header/Header";
import { ICONS } from "../../config/ICONS";
import { STUDENT_TABS } from "../../config/STUDENT_TABS";
import Button from "../../components/button/Button";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";
import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// import "leaflet-routing-machine";

import MapView from "../../components/map/MapView";

const Students = () => {
    const [activeTab, setActiveTab] = useState("active");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);   // trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState(5);   // số dòng mỗi trang

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null); // Vị trí mặc định (HCM)
    const [index, setIndex] = useState(0);

    // const fetchStudents = async () => {
    //         try {
    //         setData(mockData[activeTab] || []);
    //     }
    //     catch (error) {
    //         console.error("Error fetching students:", error);
    //         setData([]);
    //     }
    //     finally {
    //         setLoading(false);
    //     }
    // }


//     const fetchStudents = async () => {
//     try {
//         const res = await api.get("/students");

//         // Xử lý dữ liệu ngay tại đây
//         const processed = res.data.map((item, i) => ({
//             ...item,
//             index: i + 1
//         }));

//         // Cập nhật state
//         setData(processed);

//         console.log("Fetched students:", processed);
//     } 
//     catch (error) {
//         console.error("Error fetching students:", error);
//         setData([]);
//     } 
//     finally {
//         setLoading(false);
//     }
// };


    useEffect(() => {
        api.get("/students")
            .then((res) => {
                console.log("Fetched students:", res.data);

                // Dùng res.data ngay thay vì mockData (vì mockData chưa cập nhật)
                setData(res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching students:", err);
            });
    }, [activeTab]);


    const totalPages = Math.ceil(data.length / rowsPerPage);

    const indexOfLast = currentPage * rowsPerPage;         // ví dụ: 1*5 = 5
    const indexOfFirst = indexOfLast - rowsPerPage;        // 5 - 5 = 0
    const currentData = data.slice(indexOfFirst, indexOfLast);

    const currentColumns = STUDENT_TABS[activeTab].columns;

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
                    <button className="text-blue-500 hover:text-blue-700">
                        View
                    </button>
                );
            default:
                return guardian[key] || "-";
        }
    };

    // useEffect(() => {
    //     fetchStudents();
    // }, [activeTab]);

    const handleRowClick = (student) => {
        setSelectedStudent(student);
        setCurrentPosition({ lat: student.lat, lng: student.lng })
    };




    return (
        <>
            <Header />
            <div className="container">
                <div className="flex items-center justify-between">
                    <TitlePage title="Students" icon={<ICONS.Students />} size="text-2xl"
                        color="text-gray-700" />
                    <Button title="Add Student" icon={<ICONS.plus />} />
                </div>
                <SearchBar />
                <Table
                    loading={loading}
                    data={currentData}  //Dùng paginatedData thay vì filteredData
                    columns={currentColumns}
                    renderCell={renderCell}
                    funct={handleRowClick}
                />
                <div className="flex justify-center mt= 4 h-[400px]">
                    {selectedStudent && (
                        <MapView position={[selectedStudent.lat, selectedStudent.lng]} currentPosition={currentPosition} />
                    )}
                </div>
            </div>
        </>
    );
}
export default Students;