// src/pages/parent/Profile.jsx
import React from "react";

export default function Profile() {
  // Dữ liệu demo
  const parentInfo = {
    name: "Nguyễn Văn A",
    email: "parent@gmail.com",
    phone: "090xxxxxxx",
  };

  const studentInfo = {
    name: "Nguyễn Văn B",
    grade: "Lớp 3A",
    pickupPoint: "Trạm dừng D1 - Chung cư ABC",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Thông tin Cá nhân
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card thông tin phụ huynh */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Thông tin Phụ huynh
          </h2>
          <div className="space-y-3">
            <p>
              <strong>Tên:</strong> {parentInfo.name}
            </p>
            <p>
              <strong>Email:</strong> {parentInfo.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {parentInfo.phone}
            </p>
          </div>
          <button className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
            Đổi mật khẩu
          </button>
        </div>

        {/* Card thông tin học sinh */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Thông tin Học sinh
          </h2>
          <div className="space-y-3">
            <p>
              <strong>Tên:</strong> {studentInfo.name}
            </p>
            <p>
              <strong>Lớp:</strong> {studentInfo.grade}
            </p>
            <p>
              <strong>Điểm đón:</strong> {studentInfo.pickupPoint}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
