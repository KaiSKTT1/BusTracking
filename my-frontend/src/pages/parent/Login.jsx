import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/apiRequest";
export default function ParentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const handleLogin = () => {
  //   if (email === "parent@gmail.com" && password === "123456") {
  //     localStorage.setItem("parentLoggedIn", "true");
  //     navigate("/parent/dashboard");
  //   } else {
  //     alert("Sai email hoặc mật khẩu! (demo: parent@gmail.com / 123456)");
  //   }
  // };
  const handleLogin = (e) => {
    e.preventDefault();
    const user = { email, password, role_id: 3 };
    loginUser(user, dispatch, navigate);
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
