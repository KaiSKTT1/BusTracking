// src/pages/parent/Profile.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function Profile() {
  const [parent, setParent] = useState(null);
  const [students, setStudents] = useState([]);
  const parentId = Number(localStorage.getItem("parentId")) || null;

  useEffect(() => {
    if (!parentId) return;
    (async () => {
      try {
        const uRes = await api.get("/user_account");
        const users =
          Array.isArray(uRes.data) ||
          Array.isArray(uRes.data?.data) ||
          uRes.data?.data
            ? uRes.data
            : [];
        const me = users.find((u) => Number(u.user_id) === Number(parentId));
        setParent(me || null);

        const sRes = await api.get("/student");
        const studentsAll =
          Array.isArray(sRes.data) ||
          Array.isArray(sRes.data?.data) ||
          sRes.data?.data
            ? sRes.data
            : [];
        const myStudents = studentsAll.filter(
          (s) => Number(s.id_ph) === Number(parentId)
        );
        setStudents(myStudents);
      } catch (err) {
        console.error("Error loading profile:", err);
        setParent(null);
        setStudents([]);
      }
    })();
  }, [parentId]);

  if (!parentId) {
    return (
      <p className="p-4">
        Chưa đăng nhập phụ huynh. Vui lòng đăng nhập.
      </p>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Thông tin Cá nhân
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Thông tin Phụ huynh
          </h2>
          {parent ? (
            <div className="space-y-3">
              <p>
                <strong>Tên:</strong> {parent.username ?? parent.name ?? "-"}
              </p>
              <p>
                <strong>Email:</strong> {parent.email ?? "-"}
              </p>
              <p>
                <strong>Trạng thái:</strong> {parent.status ?? "-"}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Không có thông tin phụ huynh.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Thông tin Học sinh
          </h2>
          {students.length ? (
            students.map((st) => (
              <div key={st.student_id} className="mb-4">
                <p>
                  <strong>Tên:</strong> {st.name}
                </p>
                <p>
                  <strong>Lớp / Ghi chú:</strong> {st.note ?? "-"}
                </p>
                <p>
                  <strong>School ID:</strong> {st.school_id ?? "-"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Không tìm thấy học sinh liên kết.</p>
          )}
        </div>
      </div>
    </div>
  );
}
