import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/apiRequest";


export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const handleLogin = () => {
  //   // Tài khoản demo cho Admin
  //   if (email === "admin@gmail.com" && password === "admin123") {
  //     // Lưu trạng thái đăng nhập vào localStorage
  //     localStorage.setItem("adminLoggedIn", "true");
  //     // Chuyển hướng tới dashboard của Admin
  //     navigate("/admin/dashboard");
  //   } else {
  //     alert("Sai email hoặc mật khẩu! (demo: admin@gmail.com / admin123)");
  //   }
  // };
  const handleLogin = (e) => {
    e.preventDefault();
    const user = { email, password, role_id: 1 };
    loginUser(user, dispatch, navigate);
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
          className="w-full border rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md p-2 mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
