import React from "react";

export default function ParentNotifications() {
  const notes = [
    "Xe rời trạm lúc 7:05 AM",
    "Xe đến gần điểm đón",
    "Xe đã đến trường lúc 7:45 AM",
  ];

  return (
    <main className="p-6">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <div className="bg-white p-4 rounded shadow">
        <ul className="space-y-2">
          {notes.map((n, i) => (
            <li key={i} className="text-sm text-gray-700">
              {n}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
