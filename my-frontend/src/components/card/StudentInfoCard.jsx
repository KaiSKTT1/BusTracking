import React from "react";

export default function StudentInfoCard({ student }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
          {student.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {student.name}
          </h3>
          <p className="text-gray-600">
            {student.grade} - {student.school}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p>
          <strong className="w-24 inline-block">Status:</strong>
          <span
            className={`${
              student.status === "Đang trên xe"
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            {student.status}
          </span>
        </p>
        <p>
          <strong className="w-32 inline-block">Pickup Point:</strong>
          <span>{student.pickupPoint}</span>
        </p>
      </div>

      <div className="flex gap-4 mt-6">
        <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          View History
        </button>
        <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">
          Details
        </button>
      </div>
    </div>
  );
}
