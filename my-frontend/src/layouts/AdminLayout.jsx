import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar /> {/* Sidebar của Admin luôn hiển thị */}
      <div className="flex-1">
        <Header /> {/* Header của Admin luôn hiển thị */}
        <main className="p-6">
          {children} {/* Đây là nơi nội dung trang sẽ được chèn vào */}
        </main>
      </div>
    </div>
  );
}
