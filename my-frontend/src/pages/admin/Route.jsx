import { useState } from "react";
import TitlePage from "../../components/title_pages/TitlePage";
import { ICONS } from "../../config/ICONS";
import Button from "../../components/button/Button";
import ItemRoute from "../../components/ItemRoute/ItemRoute";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MultiRouting from "../../components/map/MultiRouting";
import { FaLayerGroup } from "react-icons/fa";

const Route = () => {
    const RoutesIcon = ICONS.Routes;
    const PlusIcon = ICONS.plus;

    // Mảng màu sắc cho các tuyến
    const routeColors = [
        "#3B82F6", // Blue
        "#EF4444", // Red
        "#10B981", // Green
        "#F59E0B", // Amber
        "#8B5CF6", // Purple
        "#EC4899", // Pink
    ];

    // Mock data cho các tuyến đường với nhiều điểm dừng
    const [routes] = useState([
        {
            id: 1,
            name: "Tuyến 1: Bình Tân - Quận 1",
            busNumber: "BUS-001",
            status: "active",
            distance: "12.5 km",
            totalStudents: 25,
            color: routeColors[0],
            waypoints: [
                { name: "173 An Dương Vương, Bình Tân", coords: [10.737, 106.62], students: 5 },
                { name: "Chợ Bình Tân", coords: [10.745, 106.63], students: 4 },
                { name: "Aeon Mall Tân Phú", coords: [10.752, 106.645], students: 6 },
                { name: "Đầm Sen", coords: [10.7654, 106.6591], students: 5 },
                { name: "Bến Thành, Quận 1", coords: [10.7724, 106.6988], students: 5 },
            ],
        },
        {
            id: 2,
            name: "Tuyến 2: Thủ Đức - Quận 3",
            busNumber: "BUS-002",
            status: "active",
            distance: "15.2 km",
            totalStudents: 30,
            color: routeColors[1],
            waypoints: [
                { name: "Linh Trung, Thủ Đức", coords: [10.8705, 106.8005], students: 8 },
                { name: "Khu Công Nghệ Cao", coords: [10.8512, 106.7698], students: 7 },
                { name: "Giga Mall", coords: [10.8326, 106.7544], students: 6 },
                { name: "Landmark 81", coords: [10.7953, 106.7218], students: 4 },
                { name: "Võ Văn Tần, Quận 3", coords: [10.7836, 106.6908], students: 5 },
            ],
        },
        {
            id: 3,
            name: "Tuyến 3: Tân Bình - Quận 5",
            busNumber: "BUS-003",
            status: "inactive",
            distance: "8.3 km",
            totalStudents: 18,
            color: routeColors[2],
            waypoints: [
                { name: "Sân bay Tân Sơn Nhất", coords: [10.8184, 106.6574], students: 5 },
                { name: "Hoàng Văn Thụ", coords: [10.7989, 106.6652], students: 4 },
                { name: "Lý Thái Tổ, Quận 10", coords: [10.7774, 106.6695], students: 4 },
                { name: "Chợ Lớn, Quận 5", coords: [10.7554, 106.6784], students: 5 },
            ],
        },
        {
            id: 4,
            name: "Tuyến 4: Bình Thạnh - Quận 7",
            busNumber: "BUS-004",
            status: "active",
            distance: "11.8 km",
            totalStudents: 22,
            color: routeColors[3],
            waypoints: [
                { name: "Nguyễn Xí, Bình Thạnh", coords: [10.8142, 106.7072], students: 6 },
                { name: "Cầu Sài Gòn", coords: [10.7896, 106.7112], students: 5 },
                { name: "Võ Văn Kiệt, Quận 1", coords: [10.7658, 106.7054], students: 5 },
                { name: "Cầu Phú Mỹ", coords: [10.7436, 106.7156], students: 3 },
                { name: "Phú Mỹ Hưng, Quận 7", coords: [10.7285, 106.7198], students: 3 },
            ],
        },
    ]);

    const [selectedRoute, setSelectedRoute] = useState(null); // null = show all
    const [showAllRoutes, setShowAllRoutes] = useState(true);
    const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);

    const handleRouteClick = (route) => {
        setSelectedRoute(route);
        setShowAllRoutes(false);
        setIsLoadingRoutes(true);
    };

    const handleShowAllRoutes = () => {
        setSelectedRoute(null);
        setShowAllRoutes(true);
        setIsLoadingRoutes(true);
    };

    const handleRoutesLoaded = () => {
        setIsLoadingRoutes(false);
    };

    // Determine which routes to display on map
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
                    <Button
                        title="Add New Route"
                        icon={<PlusIcon className="text-white" size={18} />}
                    />
                </div>

                <div className="flex w-full space-x-6">
                    {/* Left Panel - Route List */}
                    <div className="w-96 bg-white shadow-md rounded-2xl p-5 flex flex-col space-y-4 max-h-[600px] overflow-y-auto">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Available Routes ({routes.length})
                            </h2>
                            <button
                                onClick={handleShowAllRoutes}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${showAllRoutes
                                        ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                <FaLayerGroup size={14} />
                                All
                            </button>
                        </div>

                        {routes.map((route) => (
                            <ItemRoute
                                key={route.id}
                                route={route}
                                isSelected={!showAllRoutes && selectedRoute?.id === route.id}
                                onClick={() => handleRouteClick(route)}
                            />
                        ))}
                    </div>

                    {/* Right Panel - Map */}
                    <div className="flex-grow h-[600px] bg-white shadow-md rounded-2xl overflow-hidden">
                        <div className="h-full flex flex-col">
                            {/* Map Header */}
                            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                                <h3 className="font-semibold text-gray-800 text-lg">
                                    {showAllRoutes
                                        ? "All Bus Routes Overview"
                                        : selectedRoute?.name || "Route View"}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {showAllRoutes
                                        ? `Displaying ${routes.length} routes on the map`
                                        : selectedRoute?.waypoints
                                            ? `${selectedRoute.waypoints[0]?.name} → ${selectedRoute.waypoints[selectedRoute.waypoints.length - 1]?.name}`
                                            : "No waypoints"}
                                </p>

                                {/* Legend */}
                                <div className="flex flex-wrap gap-3 mt-3">
                                    {displayedRoutes.map((route) => (
                                        <div
                                            key={route.id}
                                            className="flex items-center gap-2 text-xs cursor-pointer hover:opacity-80"
                                            onClick={() => handleRouteClick(route)}
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: route.color }}
                                            ></div>
                                            <span className={`${!showAllRoutes && selectedRoute?.id === route.id ? 'font-bold' : ''}`}>
                                                {route.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Map Container */}
                            <div className="flex-grow relative">
                                {/* Loading Overlay */}
                                {isLoadingRoutes && (
                                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000]">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
                                            <p className="text-sm text-gray-600">Loading routes...</p>
                                        </div>
                                    </div>
                                )}

                                <MapContainer
                                    key={showAllRoutes ? 'all-routes' : `route-${selectedRoute?.id}`}
                                    center={
                                        showAllRoutes
                                            ? [10.7769, 106.7009]
                                            : selectedRoute?.waypoints?.[0]?.coords || [10.7769, 106.7009]
                                    }
                                    zoom={showAllRoutes ? 11 : 12}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                    />

                                    {/* Markers for all waypoints */}
                                    {displayedRoutes.map((route) => (
                                        <div key={route.id}>
                                            {route.waypoints?.map((waypoint, index) => (
                                                <Marker key={`${route.id}-${index}`} position={waypoint.coords}>
                                                    <Popup>
                                                        <div className="text-sm">
                                                            <p className="font-semibold" style={{ color: route.color }}>
                                                                {route.name}
                                                            </p>
                                                            <p
                                                                className={`font-medium ${index === 0
                                                                        ? "text-green-600"
                                                                        : index === route.waypoints.length - 1
                                                                            ? "text-red-600"
                                                                            : "text-blue-600"
                                                                    }`}
                                                            >
                                                                {index === 0
                                                                    ? "Điểm bắt đầu"
                                                                    : index === route.waypoints.length - 1
                                                                        ? "Điểm kết thúc"
                                                                        : `Điểm dừng ${index}`}
                                                            </p>
                                                            <p>{waypoint.name}</p>
                                                            {waypoint.students > 0 && (
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Students: {waypoint.students}
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-gray-500">Bus: {route.busNumber}</p>
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                            ))}
                                        </div>
                                    ))}

                                    {/* Display routes based on mode */}
                                    <MultiRouting
                                        routes={displayedRoutes}
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
