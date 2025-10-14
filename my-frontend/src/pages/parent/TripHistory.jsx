// src/pages/parent/TripHistory.jsx
import React from "react";

export default function TripHistory() {
  // Dữ liệu demo, sau này sẽ thay bằng API
  const pastTrips = [
    {
      id: 1,
      date: "Thứ Hai, 13/10/2025",
      pickupTime: "07:15 AM",
      dropOffTime: "04:30 PM",
      status: "Hoàn thành",
    },
    {
      id: 2,
      date: "Thứ Sáu, 10/10/2025",
      pickupTime: "07:18 AM",
      dropOffTime: "04:35 PM",
      status: "Hoàn thành",
    },
    {
      id: 3,
      date: "Thứ Năm, 09/10/2025",
      pickupTime: "07:12 AM",
      dropOffTime: "04:28 PM",
      status: "Hoàn thành",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Lịch sử Chuyến đi
      </h1>
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        {pastTrips.map((trip) => (
          <div key={trip.id} className="border-b pb-4 last:border-b-0">
            <p className="font-semibold text-lg">{trip.date}</p>
            <div className="flex justify-between items-center mt-2 text-gray-600">
              <span>Đón lúc: {trip.pickupTime}</span>
              <span>Trả lúc: {trip.dropOffTime}</span>
              <span className="bg-green-100 text-green-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {trip.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
