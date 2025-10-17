import React from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-10 text-blue-600">
        Smart School Bus System
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => navigate("/login")}
          className="w-48 h-40 bg-white border-2 border-blue-500 rounded-2xl shadow-md hover:shadow-lg hover:bg-blue-50 flex flex-col items-center justify-center transition"
        >
          <span className="text-5xl mb-2">🧑‍💼</span>
          <span className="font-semibold text-lg text-blue-600">Admin</span>
        </button>

        <button
          onClick={() => navigate("/parent/login")}
          className="w-48 h-40 bg-white border-2 border-green-500 rounded-2xl shadow-md hover:shadow-lg hover:bg-green-50 flex flex-col items-center justify-center transition"
        >
          <span className="text-5xl mb-2">👨‍👩‍👧</span>
          <span className="font-semibold text-lg text-green-600">Parent</span>
        </button>
      </div>

      <footer className="mt-12 text-sm text-gray-500">
        © 2025 Smart School Bus Tracking Demo
      </footer>
    </div>
  );
}
