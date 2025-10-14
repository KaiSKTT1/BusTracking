import React from "react";
import SidebarParent from "../components/parent/SidebarParent";
import HeaderParent from "../components/parent/HeaderParent";

export default function ParentLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarParent /> {/* Sidebar của Parent */}
      <div className="flex-1">
        <HeaderParent /> {/* Header của Parent */}
        <main className="p-6">
          {children} {/* Nội dung trang của Parent sẽ được chèn vào đây */}
        </main>
      </div>
    </div>
  );
}
