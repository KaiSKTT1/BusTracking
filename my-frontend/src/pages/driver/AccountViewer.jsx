import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../../components/header/Header";
import TitlePage from "../../components/title_pages/TitlePage";
import { ICONS } from "../../config/ICONS";
import api from "../../utils/axios";

const AccountViewer = () => {
    const DriverIcon = ICONS.AccountViewer;

    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        status: ""
    });

    useEffect(() => {
        const fetchDriverInfo = async () => {
            try {
                const userData = localStorage.getItem("user");
                if (!userData) {
                    alert("Không tìm thấy thông tin người dùng đăng nhập!");
                    setLoading(false);
                    return;
                }

                const parsed = JSON.parse(userData);
                const userId = parsed.user_id;

                const res = await api.get(`/user/${userId}`);
                const user = res.data.data;
                console.log("🔍 API trả về:", user);

                if (user) {
                    setDriver(user);
                    setFormData({
                        username: user.name,   // 🔥 sửa
                        email: user.email,
                        password: "",
                        status: user.status
                    });
                }
            } catch (err) {
                console.error("❌ Lỗi khi tải thông tin tài xế:", err);
                alert("Đã xảy ra lỗi khi tải thông tin tài xế!");
            } finally {
                setLoading(false);
            }
        };

        fetchDriverInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const roleMap = {
        "Admin": 1,
        "Driver": 2,
        "Parent": 3
    };

    const handleSave = async () => {
        try {
            const userId = driver.id;

            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password || null,
                status: formData.status,
                role_id: roleMap[driver.role]   // ✔ dùng role thật để map
            };

            console.log("📤 Payload gửi API:", payload);

            const res = await api.put(`/user/${userId}`, payload);

            if (res.status === 200) {
                alert("Cập nhật thành công!");

                setDriver(prev => ({
                    ...prev,
                    name: formData.username,
                    email: formData.email,
                    status: formData.status
                }));

                setFormData(prev => ({ ...prev, password: "" }));
                setIsEditing(false);
            }
        } catch (err) {
            console.error("❌ Lỗi update:", err);
            alert("Cập nhật thất bại!");
        }
    };



    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600 text-lg animate-pulse">Đang tải thông tin tài xế...</p>
            </div>
        );

    if (!driver)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500 text-lg">Không có dữ liệu tài xế!</p>
            </div>
        );

    return (
        <>
            <Header />
            <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto">
                    <TitlePage
                        title="Thông tin tài xế đăng nhập"
                        icon={<DriverIcon className="text-green-700" size={30} />}
                        size="text-2xl sm:text-3xl"
                        color="text-gray-700"
                        className="mb-6 text-center sm:text-left"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg"
                    >
                        {!isEditing ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm sm:text-base border-collapse">
                                        <tbody>
                                            <tr>
                                                <td className="border p-2 font-semibold text-gray-700 w-1/3">
                                                    Mã tài xế
                                                </td>
                                                <td className="border p-2 break-all">{driver.user_id}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2 font-semibold text-gray-700">
                                                    Tên tài khoản
                                                </td>
                                                <td className="border p-2">{driver.name}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2 font-semibold text-gray-700">
                                                    Email
                                                </td>
                                                <td className="border p-2 break-all">{driver.email}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2 font-semibold text-gray-700">
                                                    Vai trò
                                                </td>
                                                <td className="border p-2">
                                                    {driver.role === "Driver" ? "Tài xế" : driver.role}
                                                </td>

                                            </tr>
                                            <tr>
                                                <td className="border p-2 font-semibold text-gray-700">
                                                    Trạng thái
                                                </td>
                                                <td className="border p-2 capitalize">
                                                    {driver.status === "active"
                                                        ? "Đang hoạt động"
                                                        : "Ngừng hoạt động"}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-center sm:justify-end mt-6">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
                                    >
                                        ✏️ Chỉnh sửa
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">
                                        Tên tài khoản
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">
                                        Mật khẩu mới (tùy chọn)
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Để trống nếu không đổi"
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">
                                        Trạng thái
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400"
                                    >
                                        <option value="active">Đang hoạt động</option>
                                        <option value="inactive">Ngừng hoạt động</option>
                                    </select>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition shadow"
                                    >
                                        💾 Lưu
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default AccountViewer;
