import React, { useState, useEffect } from "react";
import TitlePage from "../../components/title_pages/TitlePage";
import { ICONS } from "../../config/ICONS";
import Button from "../../components/button/Button";
import ItemRoute from "../../components/ItemRoute/ItemRoute";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MultiRouting from "../../components/map/MultiRouting";
import { FaLayerGroup } from "react-icons/fa";
import api from "../../utils/axios";

const ScheduleViewer = () => {
  const BusIcon = ICONS.Buses;
  const PlusIcon = ICONS.plus;

  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [loadingMap, setLoadingMap] = useState(true);

  const currentDriverId = Number(localStorage.getItem("driverId")) || 3;

  useEffect(() => {
    fetchSchedules();
  }, []);

  // =============================
  // 🔥 LẤY LỊCH TRÌNH THEO DRIVER_ID
  // =============================
  const fetchSchedules = async () => {
    try {
      setLoadingMap(true);

      // GỌI API ĐÚNG
      const res = await api.get(`/timetable/driver/${currentDriverId}/routes`);
      const data = Array.isArray(res.data?.data) ? res.data.data : [];

      // MAP DATA THÀNH SCHEDULE CHO MAP
      const driverSchedules = data.map((item, idx) => ({
        id: item.route_id + "-" + idx,
        name: item.route_name,
        busNumber: item.bus_license ?? "Unknown Bus",
        runDate: item.planned_date,
        color: ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"][idx % 5],

        // Nếu API có stops thì xài
        waypoints: item.stops || []
      }));

      setSchedules(driverSchedules);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setSchedules([]);
    } finally {
      setLoadingMap(false);
    }
  };
  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowAll(false);
    setLoadingMap(true);
  };

  const handleShowAll = () => {
    setSelectedSchedule(null);
    setShowAll(true);
    setLoadingMap(true);
  };

  const handleMapLoaded = () => setLoadingMap(false);

  const displayedSchedules =
    showAll ? schedules : selectedSchedule ? [selectedSchedule] : schedules;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <TitlePage
          title="Lịch trình của tôi"
          icon={<BusIcon className="text-orange-700" size={30} />}
          size="text-2xl"
          color="text-gray-700"
        />
        <Button title="Add New Schedule" icon={<PlusIcon className="text-white" size={18} />} />
      </div>

      <div className="flex w-full space-x-6">
        {/* DANH SÁCH LỊCH TRÌNH */}
        <div className="w-96 bg-white shadow-md rounded-2xl p-5 flex flex-col space-y-4 max-h-[600px] overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Schedules ({schedules.length})
            </h2>
            <button
              onClick={handleShowAll}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${showAll
                ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              <FaLayerGroup size={14} />
              All
            </button>
          </div>

          {schedules.map((schedule) => (
            <ItemRoute
              key={schedule.id}
              route={schedule}
              isSelected={!showAll && selectedSchedule?.id === schedule.id}
              onClick={() => handleScheduleClick(schedule)}
            />
          ))}
        </div>

        {/* BẢN ĐỒ */}
        <div className="flex-grow h-[600px] bg-white shadow-md rounded-2xl overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h3 className="font-semibold text-gray-800 text-lg">
                {showAll ? "All Schedules Overview" : selectedSchedule?.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {showAll
                  ? `Displaying ${schedules.length} schedules`
                  : selectedSchedule?.waypoints?.length > 0
                    ? `${selectedSchedule.waypoints[0]?.name} → ${selectedSchedule.waypoints[selectedSchedule.waypoints.length - 1]?.name
                    }`
                    : "No waypoints"}
              </p>
            </div>

            <div className="flex-grow relative">
              {loadingMap && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
                    <p className="text-sm text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}

              <MapContainer
                key={showAll ? "all-schedules" : `schedule-${selectedSchedule?.id}`}
                center={
                  showAll
                    ? [10.7769, 106.7009]
                    : selectedSchedule?.waypoints?.[0]?.coords || [10.7769, 106.7009]
                }
                zoom={showAll ? 11 : 12}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />

                {displayedSchedules.map((schedule) => (
                  <React.Fragment key={schedule.id}>
                    {schedule.waypoints?.length > 0 &&
                      schedule.waypoints.map((wp, idx) => (
                        <Marker key={`${schedule.id}-${idx}`} position={wp.coords}>
                          <Popup>
                            <div className="text-sm">
                              <p className="font-semibold" style={{ color: schedule.color }}>
                                {schedule.name}
                              </p>
                              <p
                                className={`font-medium ${idx === 0
                                  ? "text-green-600"
                                  : idx === schedule.waypoints.length - 1
                                    ? "text-red-600"
                                    : "text-blue-600"
                                  }`}
                              >
                                {idx === 0
                                  ? "Start"
                                  : idx === schedule.waypoints.length - 1
                                    ? "End"
                                    : wp.name}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                  </React.Fragment>
                ))}

                <MultiRouting
                  routes={displayedSchedules.filter(
                    (s) => s.waypoints && s.waypoints.length > 1
                  )}
                  onRoutesLoaded={handleMapLoaded}
                />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleViewer;
