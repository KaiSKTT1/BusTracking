import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeaderParent() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("parentLoggedIn");
    navigate("/parent/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white shadow-md">
      <h1 className="text-lg font-semibold text-blue-600">Smart School Bus</h1>
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          🔔
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-300" />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded-md"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
