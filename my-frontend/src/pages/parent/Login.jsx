import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

export default function ParentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // thử endpoint auth nếu có
    try {
      const authRes = await api
        .post("/auth/login", {email, password })
        .catch(() => null);
      if (authRes?.data?.user) {
        const user = authRes.data.user;
        if ((user.role_id ?? user.role) === "Parent") {
          localStorage.setItem("parentLoggedIn", "true");
          localStorage.setItem("parentId", String(user.user_id ?? user.id));
          navigate("/parent/dashboard");
          return;
        } else {
          alert("Tài khoản không phải phụ huynh.");
          return;
        }
      }
    } catch (e) {
      // ignore
    }

    // fallback: tìm trong user_account
    try {
      const q = `?username=${encodeURIComponent(email)}&password=${encodeURIComponent(
        password
      )}`;
      const res = await api.get(`/user_account${q}`);
      const users = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      if (users.length > 0) {
        const user = users[0];
        if ((user.role_id ?? user.role) === 3) {
          localStorage.setItem("parentLoggedIn", "true");
          localStorage.setItem("parentId", String(user.user_id ?? user.id));
          navigate("/parent/dashboard");
          return;
        } else {
          alert("Tài khoản không phải phụ huynh.");
          return;
        }
      }
    } catch (err) {
      console.warn("API user lookup failed:", err);
    }

    // demo fallback
    if (email === "parent@gmail.com" && password === "123456") {
      localStorage.setItem("parentLoggedIn", "true");
      localStorage.setItem("parentId", "5"); // example id from SQL dump
      navigate("/parent/dashboard");
      return;
    }

    alert("Sai email hoặc mật khẩu (demo: parent@gmail.com / 123456).");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Parent Login
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
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          Login
        </button>
      </div>
    </div>
  );
}
