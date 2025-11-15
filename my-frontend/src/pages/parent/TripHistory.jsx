// src/pages/parent/TripHistory.jsx
import React, { useState, useEffect } from "react";
import api from "../../utils/axios";

export default function TripHistory() {
  const [history, setHistory] = useState([]);
  const parentId = Number(localStorage.getItem("parentId")) || null;

  useEffect(() => {
    if (!parentId) return;
    (async () => {
      try {
        // lấy các học sinh của phụ huynh
        const sRes = await api.get("/student");
        const students =
          Array.isArray(sRes.data) ? sRes.data : Array.isArray(sRes.data?.data) ? sRes.data.data : [];
        const myStudents = students.filter((s) => Number(s.id_ph) === Number(parentId));

        if (myStudents.length === 0) {
          setHistory([]);
          return;
        }

        // lấy student_ride để biết timetable của học sinh
        const srRes = await api.get("/student_ride");
        const rides =
          Array.isArray(srRes.data) ? srRes.data : Array.isArray(srRes.data?.data) ? srRes.data.data : [];

        const timetableIds = rides
          .filter((r) => myStudents.some((ms) => Number(ms.student_id) === Number(r.student_id)))
          .map((r) => r.timetable_id);

        // lấy timetable + trip để biết thời gian
        const ttRes = await api.get("/timetable");
        const timetables =
          Array.isArray(ttRes.data) ? ttRes.data : Array.isArray(ttRes.data?.data) ? ttRes.data.data : [];

        const tripRes = await api.get("/trip");
        const trips = Array.isArray(tripRes.data) ? tripRes.data : Array.isArray(tripRes.data?.data) ? tripRes.data.data : [];

        const tripMap = new Map(trips.map((t) => [t.trip_id ?? t.id, t]));

        const records = timetables
          .filter((tt) => timetableIds.includes(Number(tt.timetable_id)))
          .map((tt) => {
            const trip = tripMap.get(tt.trip_id) || {};
            return {
              id: tt.timetable_id,
              date: tt.planned_date ?? "-",
              pickupTime: trip.time_arrival_first ?? "-",
              dropOffTime: trip.time_arrival_end ?? "-",
              status: new Date(tt.planned_date) < new Date() ? "Hoàn thành" : "Sắp tới",
              raw: { tt, trip },
            };
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setHistory(records);
      } catch (err) {
        console.error("Error loading trip history:", err);
        setHistory([]);
      }
    })();
  }, [parentId]);

  if (!parentId) {
    return <p className="p-4">Chưa đăng nhập phụ huynh. Vui lòng đăng nhập.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lịch sử Chuyến đi</h1>
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        {history.length === 0 && <p className="text-gray-500">Không có lịch sử.</p>}
        {history.map((trip) => (
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
