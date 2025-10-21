import React, { useState, useMemo } from "react";
import MapView from "../../components/map/MapView";
import Routing from "../../components/map/Routing";

const allPastTrips = [
  {
    id: 1,
    studentName: "John Doe",
    date: "2025/10/20",
    pickupTime: "07:15 AM",
    dropOffTime: "04:30 PM",
    route: { from: [10.7626, 106.6601], to: [10.7769, 106.6954] },
  },
  {
    id: 2,
    studentName: "Jane Smith",
    date: "2025/10/20",
    pickupTime: "07:05 AM",
    dropOffTime: "04:25 PM",
    route: { from: [10.7768, 106.7008], to: [10.7769, 106.6954] },
  },
  {
    id: 3,
    studentName: "John Doe",
    date: "2025/10/19",
    pickupTime: "07:14 AM",
    dropOffTime: "04:32 PM",
    route: { from: [10.7626, 106.6601], to: [10.7769, 106.6954] },
  },
];
const studentsList = ["John Doe", "Jane Smith"];

export default function TripHistory() {
  const [selectedStudent, setSelectedStudent] = useState("All Students");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTripRoute, setSelectedTripRoute] = useState(null);

  // Lọc chuyến đi theo học sinh
  const filteredTrips = useMemo(() => {
    if (selectedStudent === "All Students") {
      return allPastTrips;
    }
    return allPastTrips.filter((trip) => trip.studentName === selectedStudent);
  }, [selectedStudent]);

  const handleViewRoute = (route) => {
    setSelectedTripRoute(route);
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Trip History</h1>

      <div className="mb-4 max-w-xs">
        <label
          htmlFor="student-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Filter by student:
        </label>
        <select
          id="student-filter"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option>All Students</option>
          {studentsList.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Pick up time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Pay time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Route
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTrips.map((trip) => (
              <tr key={trip.id}>
                <td className="px-6 py-4">{trip.date}</td>
                <td className="px-6 py-4">{trip.studentName}</td>
                <td className="px-6 py-4">{trip.pickupTime}</td>
                <td className="px-6 py-4">{trip.dropOffTime}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewRoute(trip.route)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Route
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedTripRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl relative">
            <h2 className="text-xl font-semibold mb-4">Route details</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl"
            >
              &times;
            </button>

            <div className="h-[400px] w-full">
              <MapView position={selectedTripRoute.from}>
                <Routing
                  start={selectedTripRoute.from}
                  end={selectedTripRoute.to}
                  isAnimated={false}
                />
              </MapView>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
