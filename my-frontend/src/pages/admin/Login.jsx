import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res?.data?.user && res.data.user.role_id === 1) {
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminId", String(res.data.user.user_id));
        navigate("/admin/dashboard");
        return;
      }
    } catch (err) {
      console.error("Login error:", err);
    }

    alert("❌ Sai email hoặc mật khẩu!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Admin Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Đang đăng nhập..." : "Login"}
        </button>
      </div>
    </div>
  );
}
