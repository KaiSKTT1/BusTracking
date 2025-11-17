import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast"; // <-- 1. IMPORT TOAST

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      
      console.log("Backend response:", res.data); // Thêm log này để kiểm tra

      // SỬA 2: Kiểm tra "role" (chữ) thay vì "role_id" (số)
      if (res?.data?.user && res.data.user.role === "Admin") {
        // Đăng nhập thành công VÀ đúng quyền
        toast.success("Đăng nhập thành công!");
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminId", String(res.data.user.user_id));
        navigate("/admin/dashboard");
        setLoading(false); // Dừng loading
        return; // Thoát khỏi hàm
      } else {
        // Đăng nhập thành công, nhưng không phải 'Admin' (ví dụ: 'Driver')
        toast.error("Tài khoản này không có quyền Admin!");
      }

    } catch (err) {
      // SỬA 3: Xử lý lỗi từ API (401 Sai mật khẩu, 403 Bị khóa, 500...)
      console.error("Login error:", err);
      const message = err.response?.data?.message || "Email hoặc password sai!";
      toast.error(message);
    }

    // Chỉ chạy setLoading(false) ở đây nếu đăng nhập thất bại
    setLoading(false);
    // Xóa dòng alert("❌ Sai email hoặc mật khẩu!"); ở đây
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
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50" // Thêm 'disabled:opacity-50'
        >
          {loading ? "Đang đăng nhập..." : "Login"}
        </button>
      </div>
    </div>
  );
}