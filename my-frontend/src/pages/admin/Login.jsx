import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

export default function AdminLogin() {
  const [email, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Thử endpoint auth nếu tồn tại
    try {
      const authRes = await api
        .post("/auth/login", { email, password })
        .catch(() => null);
      if (authRes?.data?.user) {
        const user = authRes.data.user;
        if ((user.role_id ?? user.role) === "Admin" || (user.role_id ?? user.role) === 1) {
          localStorage.setItem("adminLoggedIn", "true");
          localStorage.setItem("adminId", String(user.user_id ?? user.id));
          navigate("/admin/dashboard");
          return;
        } else {
          alert("Người dùng không phải quản trị viên.");
          return;
        }
      }
    } catch (e) {
      // ignore and fallback
    }

    // Fallback: kiểm tra trực tiếp trong user_account table via query params
    try {
      const q = `?username=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`;
      const res = await api.get(`/user_account${q}`);
      const users = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      if (users.length > 0) {
        const user = users[0];
        if ((user.role_id ?? user.role) === 1) {
          localStorage.setItem("adminLoggedIn", "true");
          localStorage.setItem("adminId", String(user.user_id ?? user.id));
          navigate("/admin/dashboard");
          return;
        } else {
          alert("Tài khoản không phải quản trị viên.");
          return;
        }
      }
    } catch (err) {
      console.warn("API user lookup failed:", err);
    }

    // demo fallback
    if (email === "admin@gmail.com" && password === "123456") {
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminId", "1");
      navigate("/admin/dashboard");
      return;
    }

    alert("Sai tài khoản hoặc mật khẩu (demo: admin@gmail.com / 123456).");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Admin Login
        </h2>
        <input
          type="text"
          placeholder="Email hoặc username"
          value={email}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          className="w-full border rounded-md p-2 mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md p-2 mb-6"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          Login
        </button>
      </div>
    </div>
  );
}