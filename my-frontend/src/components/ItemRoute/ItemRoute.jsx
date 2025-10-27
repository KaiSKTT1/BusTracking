import { FaBus, FaMapMarkerAlt, FaUsers, FaRoad } from "react-icons/fa";

const ItemRoute = ({ route, isSelected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected
                    ? "border-orange-500 bg-orange-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
            style={{
                borderLeftWidth: "6px",
                borderLeftColor: route.color,
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
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

            {/* Bus Number */}
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                <FaBus className="text-orange-500" />
                <span className="font-medium">{route.busNumber}</span>
            </div>

            {/* Waypoints List */}
            <div className="space-y-2 mb-3">
                {route.waypoints && route.waypoints.length > 0 ? (
                    route.waypoints.map((waypoint, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                            <FaMapMarkerAlt
                                className={`mt-1 flex-shrink-0 ${index === 0
                                        ? "text-green-500"
                                        : index === route.waypoints.length - 1
                                            ? "text-red-500"
                                            : "text-blue-500"
                                    }`}
                                size={12}
                            />
                            <div className="flex-1">
                                <p className="text-gray-600 leading-tight">
                                    {waypoint.name}
                                </p>
                                {waypoint.students > 0 && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {waypoint.students} students
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-gray-400 italic">No waypoints defined</div>
                )}
            </div>

            {/* Footer Stats */}
            <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                    <FaRoad className="text-blue-500" />
                    <span className="font-medium">Distance:</span>
                    <span>{route.distance}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                    <FaUsers className="text-orange-500" />
                    <span className="font-medium">Total:</span>
                    <span>{route.totalStudents}</span>
                </div>
            </div>
        </div>
    );
};

export default ItemRoute;
