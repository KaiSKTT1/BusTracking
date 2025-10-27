import { useState } from "react";
import TitlePage from "../../components/title_pages/TitlePage";
import { ICONS } from "../../config/ICONS";
import Button from "../../components/button/Button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MultiRouting from "../../components/map/MultiRouting";
import { FaLayerGroup } from "react-icons/fa";

const Route = () => {
    const BusIcon = ICONS.Buses;
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

    // Mock data cho các tuyến đường
    const [routes] = useState([
        {
            id: 1,
            name: "Tuyến 1: Bình Tân - Quận 1",
            busNumber: "BUS-001",
            startPoint: "173 An Dương Vương, Bình Tân",
            endPoint: "Bến Thành, Quận 1",
            startCoords: [10.737, 106.62],
            endCoords: [10.7724, 106.6988],
            status: "active",
            distance: "12.5 km",
            students: 25,
            color: routeColors[0],
        },
        {
            id: 2,
            name: "Tuyến 2: Thủ Đức - Quận 3",
            busNumber: "BUS-002",
            startPoint: "Linh Trung, Thủ Đức",
            endPoint: "Võ Văn Tần, Quận 3",
            startCoords: [10.8705, 106.8005],
            endCoords: [10.7836, 106.6908],
            status: "active",
            distance: "15.2 km",
            students: 30,
            color: routeColors[1],
        },
        {
            id: 3,
            name: "Tuyến 3: Tân Bình - Quận 5",
            busNumber: "BUS-003",
            startPoint: "Tân Sơn Nhất, Tân Bình",
            endPoint: "Chợ Lớn, Quận 5",
            startCoords: [10.8184, 106.6574],
            endCoords: [10.7554, 106.6784],
            status: "inactive",
            distance: "8.3 km",
            students: 18,
            color: routeColors[2],
        },
        {
            id: 4,
            name: "Tuyến 4: Bình Thạnh - Quận 7",
            busNumber: "BUS-004",
            startPoint: "Nguyễn Xí, Bình Thạnh",
            endPoint: "Phú Mỹ Hưng, Quận 7",
            startCoords: [10.8142, 106.7072],
            endCoords: [10.7285, 106.7198],
            status: "active",
            distance: "11.8 km",
            students: 22,
            color: routeColors[3],
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
                        title="Bus Routes"
                        icon={<BusIcon className="text-orange-700" size={30} />}
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
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showAllRoutes
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                title="Show all routes"
                            >
                                <FaLayerGroup size={14} />
                                All
                            </button>
                        </div>

                        {routes.map((route) => (
                            <div
                                key={route.id}
                                onClick={() => handleRouteClick(route)}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${!showAllRoutes && selectedRoute?.id === route.id
                                    ? "border-orange-500 bg-orange-50 shadow-md"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                    }`}
                                style={{
                                    borderLeftWidth: "6px",
                                    borderLeftColor: route.color,
                                }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: route.color }}
                                        ></div>
                                        <h3 className="font-semibold text-gray-800">{route.name}</h3>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${route.status === "active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {route.status === "active" ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <div className="space-y-1 text-sm text-gray-600">
                                    <p>
                                        <span className="font-medium">Bus:</span> {route.busNumber}
                                    </p>
                                    <p>
                                        <span className="font-medium">From:</span>{" "}
                                        {route.startPoint}
                                    </p>
                                    <p>
                                        <span className="font-medium">To:</span> {route.endPoint}
                                    </p>
                                    <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
                                        <span className="text-xs">
                                            <span className="font-medium">Distance:</span>{" "}
                                            {route.distance}
                                        </span>
                                        <span className="text-xs">
                                            <span className="font-medium">Students:</span>{" "}
                                            {route.students}
                                        </span>
                                    </div>
                                </div>
                            </div>
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
                                        : `${selectedRoute?.startPoint} → ${selectedRoute?.endPoint}`}
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
                                            : selectedRoute?.startCoords || [10.7769, 106.7009]
                                    }
                                    zoom={showAllRoutes ? 11 : 12}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                    />

                                    {/* Markers for displayed routes */}
                                    {displayedRoutes.map((route) => (
                                        <div key={route.id}>
                                            {/* Start Point Marker */}
                                            <Marker position={route.startCoords}>
                                                <Popup>
                                                    <div className="text-sm">
                                                        <p className="font-semibold" style={{ color: route.color }}>
                                                            {route.name}
                                                        </p>
                                                        <p className="text-green-600 font-medium">Điểm bắt đầu</p>
                                                        <p>{route.startPoint}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Bus: {route.busNumber}</p>
                                                    </div>
                                                </Popup>
                                            </Marker>

                                            {/* End Point Marker */}
                                            <Marker position={route.endCoords}>
                                                <Popup>
                                                    <div className="text-sm">
                                                        <p className="font-semibold" style={{ color: route.color }}>
                                                            {route.name}
                                                        </p>
                                                        <p className="text-red-600 font-medium">Điểm kết thúc</p>
                                                        <p>{route.endPoint}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Bus: {route.busNumber}</p>
                                                    </div>
                                                </Popup>
                                            </Marker>
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
