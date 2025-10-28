import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Header from "../../components/header/Header";
import TitlePage from "../../components/title_pages/TitlePage";
import { ICONS } from "../../config/ICONS";
import { getUserById, updateUserById } from "../../redux/apiRequest";

const AccountViewer = () => {
    const DriverIcon = ICONS.AccountViewer;
    const dispatch = useDispatch();

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

                const user = await getUserById(userId, dispatch);
                if (user) {
                    setDriver(user);
                    setFormData({
                        username: user.username,
                        email: user.email,
                        password: "",
                        status: user.status
                    });
                } else {
                    alert("Không tìm thấy thông tin tài xế trong hệ thống!");
                }
            } catch (err) {
                console.error("❌ Lỗi khi tải thông tin tài xế:", err);
                alert("Đã xảy ra lỗi khi tải thông tin tài xế!");
            } finally {
                setLoading(false);
            }
        };

        fetchDriverInfo();
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const updated = await updateUserById(driver.user_id, formData);
        if (updated) {
            alert("✅ Cập nhật thông tin thành công!");
            setDriver((prev) => ({
                ...prev,
                username: formData.username,
                email: formData.email,
                status: formData.status
            }));
            setFormData((prev) => ({ ...prev, password: "" })); // reset mật khẩu
            setIsEditing(false);
        } else {
            alert("❌ Cập nhật thất bại!");
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600 text-lg">Đang tải thông tin tài xế...</p>
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
            <div className="p-6">
                <TitlePage
                    title="Thông tin tài xế đăng nhập"
                    icon={<DriverIcon className="text-green-700" size={30} />}
                    size="text-2xl"
                    color="text-gray-700"
                    className="mb-6"
                />

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto"
                >
                    {!isEditing ? (
                        <>
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    <tr>
                                        <td className="border p-2 font-semibold text-gray-700 w-1/3">Mã tài xế</td>
                                        <td className="border p-2">{driver.user_id}</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2 font-semibold text-gray-700">Tên tài khoản</td>
                                        <td className="border p-2">{driver.username}</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2 font-semibold text-gray-700">Email</td>
                                        <td className="border p-2">{driver.email}</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2 font-semibold text-gray-700">Vai trò</td>
                                        <td className="border p-2">
                                            {driver.role_id === 2 ? "Tài xế" : "Khác"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2 font-semibold text-gray-700">Trạng thái</td>
                                        <td className="border p-2 capitalize">
                                            {driver.status === "active"
                                                ? "Đang hoạt động"
                                                : "Ngừng hoạt động"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                ✏️ Chỉnh sửa
                            </button>
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
                                    className="w-full border p-2 rounded"
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
                                    className="w-full border p-2 rounded"
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
                                    className="w-full border p-2 rounded"
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
                                    className="w-full border p-2 rounded"
                                >
                                    <option value="active">Đang hoạt động</option>
                                    <option value="inactive">Ngừng hoạt động</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                >
                                    💾 Lưu
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    );
};

export default AccountViewer;
