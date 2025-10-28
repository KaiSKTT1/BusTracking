import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // tránh reload trang khi submit form

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        name: username,
        password: password,
      });

      if (res.data.success) {
        alert("Đăng nhập thành công!");
        navigate("/"); // quay lại Dashboard
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
    //   setError("Sai tài khoản hoặc mật khẩu!");
    navigate("/");               // tạm thời bỏ qua login
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
    <form onSubmit={handleLogin}
    className="bg-white p-8 rounded shadow-md w-96">
         <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
      <input
        type="text"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-6 px-3 py-2 border border-gray-300 rounded"
      />
      <button type="submit"
      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Đăng nhập</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
    </div>
  );
}

export default Login;
