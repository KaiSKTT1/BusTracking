import React, { useState, useEffect } from "react";
import TitlePage from "../../components/title_pages/TitlePage";
import { ICONS } from "../../config/ICONS";
import Button from "../../components/button/Button";
import ItemRoute from "../../components/ItemRoute/ItemRoute";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MultiRouting from "../../components/map/MultiRouting";
import { FaLayerGroup } from "react-icons/fa";
import api from "../../utils/axios";

const Route = () => {
  const RoutesIcon = ICONS.Routes;
  const PlusIcon = ICONS.plus;

  const [routes, setRoutes] = useState([]); // Dữ liệu thật sẽ vào đây
  const [selectedRoute, setSelectedRoute] = useState(null); // null = show all
  const [showAllRoutes, setShowAllRoutes] = useState(true);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);

  useEffect(() => {
    const fetchRoutesAndStops = async () => {
      setIsLoadingRoutes(true);
      try {
        // BƯỚC 1: Lấy danh sách các tuyến (id, name, so_stop)
        const res = await api.get("/routes"); // Gọi API routes
        const list = Array.isArray(res.data.data) ? res.data.data : [];

        if (list.length === 0) {
          throw new Error("No routes found from API");
        }
        console.log("Bước 1: Đã lấy routes", list);

        // BƯỚC 2: Tạo mảng các promise để lấy stops cho TỪNG tuyến
        const stopPromises = list.map(route =>
          api.get(`/routes/${route.route_id}/stops`) // Gọi API lấy stops
        );

        // BƯỚC 3: Chờ tất cả API stops chạy xong
        const stopResponses = await Promise.allSettled(stopPromises);
        console.log("Bước 2: Đã lấy stops cho từng route", stopResponses);

        // BƯỚC 4: "Nhét" (stitch) dữ liệu waypoints vào các tuyến
        const transformedRoutes = list.map((route, idx) => {
          const stopData = stopResponses[idx];
          let waypoints = [];
          
          if (stopData.status === 'fulfilled' && stopData.value.data?.data) {
            // Controller của tôi trả về { message: 'ok', data: [...] }
            waypoints = stopData.value.data.data; // Đây là mảng [ {name, coords} ]
          } else {
             console.warn(`Failed to fetch stops for route: ${route.name}`);
          }
          
          return {
            id: route.route_id,
            name: route.name || "Unnamed Route",
            busNumber: `BUS-${String(route.route_id).padStart(3, '0')}`,
            status: "active", // Tạm gán
            distance: `${route.so_stop * 5} km`, // Tạm gán
            totalStudents: 0, // Tạm gán
            color: ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"][idx % 5], // Tự gán màu
            waypoints: waypoints // <-- DỮ LIỆU THẬT TỪ CSDL
          };
        });

        // BƯỚC 5: Set state với dữ liệu hoàn chỉnh
        console.log("Bước 3: Dữ liệu routes hoàn chỉnh", transformedRoutes);
        setRoutes(transformedRoutes);

      } catch (err) {
        console.error("Error fetching routes:", err);
        setRoutes([]); // Nếu lỗi, hiển thị mảng rỗng (không dùng defaultRoutes nữa)
      } finally {
        setIsLoadingRoutes(false);
      }
    };

    fetchRoutesAndStops();
  }, []);

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
    setShowAllRoutes(false);
    setIsLoadingRoutes(true); // Kích hoạt loading để MultiRouting vẽ lại
  };

  const handleShowAllRoutes = () => {
    setSelectedRoute(null);
    setShowAllRoutes(true);
    setIsLoadingRoutes(true); // Kích hoạt loading
  };

  const handleRoutesLoaded = () => {
    setIsLoadingRoutes(false);
  };

  // Quyết định xem nên hiển thị 1 hay tất cả
  const displayedRoutes = showAllRoutes ? routes : (selectedRoute ? [selectedRoute] : routes);

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <TitlePage
            title="Routes"
            icon={<RoutesIcon className="text-orange-700" size={30} />}
            size="text-2xl"
            color="text-gray-700"
          />
          <Button title="Add New Route" icon={<PlusIcon className="text-white" size={18} />} />
        </div>

        <div className="flex w-full space-x-6">
          {/* DANH SÁCH TUYẾN BÊN TRÁI */}
          <div className="w-96 bg-white shadow-md rounded-2xl p-5 flex flex-col space-y-4 max-h-[600px] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Available Routes ({routes.length})</h2>
              <button
                onClick={handleShowAllRoutes}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${showAllRoutes ? "bg-blue-500 text-white shadow-md hover:bg-blue-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                <FaLayerGroup size={14} />
                All
              </button>
            </div>

            {routes.map((route) => (
              <ItemRoute key={route.id} route={route} isSelected={!showAllRoutes && selectedRoute?.id === route.id} onClick={() => handleRouteClick(route)} />
            ))}
          </div>

          {/* BẢN ĐỒ BÊN PHẢI */}
          <div className="flex-grow h-[600px] bg-white shadow-md rounded-2xl overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <h3 className="font-semibold text-gray-800 text-lg">{showAllRoutes ? "All Bus Routes Overview" : selectedRoute?.name || "Route View"}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {showAllRoutes 
                    ? `Displaying ${routes.length} routes on the map` 
                    : (selectedRoute?.waypoints && selectedRoute.waypoints.length > 0)
                      // SỬA Ở ĐÂY: Dùng .address thay vì .name
                      ? `${selectedRoute.waypoints[0]?.address} → ${selectedRoute.waypoints[selectedRoute.waypoints.length - 1]?.address}` 
                      : "No waypoints for this route"}
                </p>

                <div className="flex flex-wrap gap-3 mt-3">
                  {displayedRoutes.map((route) => (
                    <div key={route.id} className="flex items-center gap-2 text-xs cursor-pointer hover:opacity-80" onClick={() => handleRouteClick(route)}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }}></div>
                      <span className={`${!showAllRoutes && selectedRoute?.id === route.id ? "font-bold" : ""}`}>{route.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-grow relative">
                {isLoadingRoutes && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
                      <p className="text-sm text-gray-600">Loading routes...</p>
                    </div>
                  </div>
                )}

                <MapContainer 
                  key={showAllRoutes ? "all-routes" : `route-${selectedRoute?.id}`} 
                  center={showAllRoutes ? [10.7769, 106.7009] : selectedRoute?.waypoints?.[0]?.coords || [10.7769, 106.7009]} 
                  zoom={showAllRoutes ? 11 : 12} 
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors' />

                  {/* Chỉ hiển thị Marker, không hiển thị MultiRouting nếu chỉ có 1 trạm */}
                  {displayedRoutes.map((route) => (
                    <React.Fragment key={route.id}>
                      {route.waypoints?.length > 0 && route.waypoints.map((waypoint, index) => (
                        <Marker key={`${route.id}-${index}`} position={waypoint.coords}>
                          <Popup>
                            <div className="text-sm">
                              {/* DÒNG CŨ CỦA BẠN (đã được sửa): */}
                              <p className="font-semibold" style={{ color: route.color }}>{route.name}</p>
                              <p className={`font-medium ${index === 0 ? "text-green-600" : index === route.waypoints.length - 1 ? "text-red-600" : "text-blue-600"}`}>
                                {index === 0 ? "Điểm bắt đầu" : index === route.waypoints.length - 1 ? "Điểm kết thúc" : `${waypoint.name}`}
                              </p>
                              
                              {/* THÊM DÒNG NÀY ĐỂ HIỆN ĐỊA CHỈ: */}
                              <p className="text-gray-600">{waypoint.address}</p>
                              
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </React.Fragment>
                  ))}

                  {/* Gửi routes có waypoints (lớn hơn 1) vào MultiRouting để vẽ */}
                  <MultiRouting 
                    routes={displayedRoutes.filter(r => r.waypoints && r.waypoints.length > 1)} 
                    onRoutesLoaded={handleRoutesLoaded} 
                  />
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Route;