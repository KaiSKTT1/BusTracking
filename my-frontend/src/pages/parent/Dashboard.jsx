// src/pages/parent/Dashboard.jsx
import React from "react";
import MapView from "../../components/map/MapView";

// Chỉ cần trả về nội dung chính của trang dashboard
export default function ParentDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cột bản đồ */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 h-[600px]">
        <h2 className="text-xl font-semibold mb-2">Bus Location</h2>
        <div className="h-[550px]">
          <MapView position={[10.762622, 106.660172]} />
        </div>
      </div>

      {/* Cột thông tin */}
      <div className="space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Trip Status</h3>
          <p className="text-sm text-gray-600">
            Xe đang trên đường đến trường, dự kiến 7:45 AM.
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Recent Notifications</h3>
          <ul className="mt-2 text-sm text-gray-600 space-y-1">
            <li>Xe rời bến lúc 7:05 AM</li>
            <li>Xe đến gần nhà bạn (500m)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
