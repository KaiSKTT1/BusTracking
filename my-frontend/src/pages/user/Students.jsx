import React, { useState, useEffect } from "react";
import TitlePage from "../../components/title_pages/TitlePage";
import Header from "../../components/header/Header";
import { ICONS } from "../../config/ICONS";
import { STUDENT_TABS } from "../../config/STUDENT_TABS";
import Button from "../../components/button/Button";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";

const Students = () => {
    const mockData = {
        active: [
            { id: 1, name: "John Doe", age: 16, grade: "10th", status: "active" },
            { id: 2, name: "Jane Smith", age: 17, grade: "11th", status: "active" },
        ],
        inactive: [
            { id: 3, name: "Mike Johnson", age: 18, grade: "12th", status: "inactive" },
        ],
    };

    const [activeTab, setActiveTab] = useState("active");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);   // trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState(5);   // số dòng mỗi trang

    
    const fetchStudents = async () => {
        try{
            setData(mockData[activeTab] || []);
        }
        catch(error){
            console.error("Error fetching students:", error);
            setData([]);
        }
        finally{
            setLoading(false);
        }
    }
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

    useEffect(() => {
        fetchStudents();
    }, [activeTab]);
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
                        />
                </div>
            </>
        );
}
export default Students;