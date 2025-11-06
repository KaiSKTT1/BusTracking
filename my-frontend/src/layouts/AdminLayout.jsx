import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Toast Notifications - Chỉ khai báo 1 lần cho toàn bộ admin pages */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          // Success toast - màu xanh lá cho Create
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
            style: {
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #86efac',
            },
          },
          // Error toast - màu đỏ cho Delete
          error: {
            duration: 3000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fca5a5',
            },
          },
        }}
      />

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
