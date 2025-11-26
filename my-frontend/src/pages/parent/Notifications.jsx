import React, { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function ParentNotifications() {
  const [notes, setNotes] = useState([]);
  const parentId = Number(localStorage.getItem("parentId")) || null;

  useEffect(() => {
    if (!parentId) return;
    (async () => {
      try {
        // lấy học sinh của phụ huynh
        const sRes = await api.get("/student");
        const students =
          Array.isArray(sRes.data) &&
          sRes.data.length > 0 &&
          Array.isArray(sRes.data[0].data)
            ? sRes.data[0].data
            : Array.isArray(sRes.data?.data)
            ? sRes.data.data
            : [];
        const myStudentIds = students
          .filter((s) => Number(s.id_ph) === Number(parentId))
          .map((s) => s.student_id);

        if (myStudentIds.length === 0) {
          setNotes([]);
          return;
        }

        // lấy báo cáo chi tiết chứa student_id (chitietbaocao)
        const ctRes = await api.get("/chitietbaocao");
        const details =
          Array.isArray(ctRes.data) &&
          ctRes.data.length > 0 &&
          Array.isArray(ctRes.data[0].data)
            ? ctRes.data[0].data
            : Array.isArray(ctRes.data?.data)
            ? ctRes.data.data
            : [];

        // join với baocao để lấy ngày
        const bRes = await api.get("/baocao");
        const reports =
          Array.isArray(bRes.data) &&
          bRes.data.length > 0 &&
          Array.isArray(bRes.data[0].data)
            ? bRes.data[0].data
            : Array.isArray(bRes.data?.data)
            ? bRes.data.data
            : [];

        const myNotes = details
          .filter((d) => myStudentIds.includes(Number(d.student_id)))
          .map((d) => {
            const parentReport = reports.find(
              (r) => Number(r.bao_cao_id) === Number(d.bao_cao_id)
            );
            return {
              message: d.tinh_trang ?? "Báo cáo",
              date: parentReport?.date ?? "-",
            };
          })
          .sort((a, b) => (b.date > a.date ? 1 : -1));

        // fallback: nếu ko tìm báo cáo, tạo note demo
        setNotes(
          myNotes.length
            ? myNotes
            : [
                {
                  message: "Xe sắp đến điểm đón",
                  date: new Date().toISOString().split("T")[0],
                },
              ]
        );
      } catch (err) {
        console.error("Error loading notifications:", err);
        setNotes([{ message: "Không thể tải thông báo", date: "-" }]);
      }
    })();
  }, [parentId]);

  if (!parentId)
    return <p className="p-4">Chưa đăng nhập phụ huynh.</p>;

  return (
    <main className="p-6">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <div className="bg-white p-4 rounded shadow">
        <ul className="space-y-2">
          {notes.map((n, i) => (
            <li key={i} className="text-sm text-gray-700">
              <div className="flex justify-between">
                <span>{n.message}</span>
                <small className="text-gray-400">{n.date}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
