import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

export default function DriverLogin() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Thử endpoint auth nếu tồn tại
    try {
      const authRes = await api
        .post("/auth/login", { username: emailOrUsername, password })
        .catch(() => null);
      if (authRes?.data?.user) {
        const user = authRes.data.user;
        if ((user.role_id ?? user.role) === 2) {
          localStorage.setItem("driverLoggedIn", "true");
          localStorage.setItem("driverId", String(user.user_id ?? user.id));
          navigate("/driver/pickupdropoff");
          return;
        } else {
          alert("Người dùng không phải tài xế.");
          return;
        }
      }
    } catch (e) {
      // ignore and fallback
    }

    // Fallback: kiểm tra trực tiếp trong user_account table via query params
    try {
      const q = `?username=${encodeURIComponent(
        emailOrUsername
      )}&password=${encodeURIComponent(password)}`;
      const res = await api.get(`/user_account${q}`);
      const users = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      if (users.length > 0) {
        const user = users[0];
        if ((user.role_id ?? user.role) === 2) {
          localStorage.setItem("driverLoggedIn", "true");
          localStorage.setItem("driverId", String(user.user_id ?? user.id));
          navigate("/driver/pickupdropoff");
          return;
        } else {
          alert("Tài khoản không phải tài xế.");
          return;
        }
      }
    } catch (err) {
      console.warn("API user lookup failed:", err);
    }

    // demo fallback
    if (emailOrUsername === "driver@gmail.com" && password === "123456") {
      localStorage.setItem("driverLoggedIn", "true");
      localStorage.setItem("driverId", "3");
      navigate("/driver/pickupdropoff");
      return;
    }

    alert("Sai tài khoản hoặc mật khẩu (demo: driver@gmail.com / 123456).");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Drivers Login
        </h2>
        <input
          type="text"
          placeholder="Email hoặc username"
          value={emailOrUsername}
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
