import React, { useState, useEffect } from "react";
import TitlePage from "../../components/title_pages/TitlePage";
import Header from "../../components/header/Header";
import { ICONS } from "../../config/ICONS";
import { STUDENT_TABS } from "../../config/STUDENT_TABS";
import Button from "../../components/button/Button";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from "leaflet";

const Students = () => {
    
const mockData = {
    active: [
        { id: 1, name: "John Doe", age: 16, grade: "10th", status: "active", lat: 10.762622, lng: 106.660172 },
        { id: 2, name: "Jane Smith", age: 17, grade: "11th", status: "active", lat: 10.776889, lng: 106.700806 },
    ],
    inactive: [
        { id: 3, name: "Mike Johnson", age: 18, grade: "12th", status: "inactive", lat: 21.028511, lng: 105.804817 },
    ],
};
    const [activeTab, setActiveTab] = useState("active");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);   // trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState(5);   // số dòng mỗi trang

    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleRowClick = (student) => {
        setSelectedStudent(student);
    };

    
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

    const Routing = ({ start, end }) => {
        const map = useMap();

        useEffect(() => {
            if (!map || !start || !end) return;

            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(start[0], start[1]),
                    L.latLng(end[0], end[1]),
                ],
                lineOptions: {
                    styles: [{ color: "blue", weight: 5 }],
                },
                show: false,
                addWaypoints: false,
                draggableWaypoints: false,
            }).addTo(map);

            return () => map.removeControl(routingControl);
        }, [map, start, end]);

        return null;
    };

    // 🗺️ Component hiển thị bản đồ
    const MapComponent = ({ student }) => {
        const start = [10.762622, 106.660172]; // ví dụ: trường học
        const end = [student.lat, student.lng]; // vị trí của học sinh

        return (
            <MapContainer center={start} zoom={13} style={{ height: "400px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={start}>
                    <Popup>Điểm bắt đầu (Trường học)</Popup>
                </Marker>
                <Marker position={end}>
                    <Popup>{student.name}</Popup>
                </Marker>
                <Routing start={start} end={end} />
            </MapContainer>
        );
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
                    {selectedStudent && (
                    <MapComponent student={selectedStudent} />
                )}
                </div>
            </>
        );
}
export default Students;