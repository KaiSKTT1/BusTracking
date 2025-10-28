import axios from "axios";
import { loginFail, loginStart, loginSuccess, logout } from "./authSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("http://localhost:8080/auth/login", user);

        if (res.data.accessToken) {
            dispatch(loginSuccess(res.data));
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            const roleId = res.data.role_id || res.data.user?.role_id;

            switch (roleId) {
                case 1:
                    navigate("/admin/dashboard");
                    break;
                case 2:
                    navigate("/driver/pickupdropoff");
                    break;
                case 3:
                    navigate("/parent/dashboard");
                    break;
                default:
                    navigate("/");
                    break;
            }
        } else {
            dispatch(loginFail());
            alert(res.data.error || "Sai tên đăng nhập hoặc mật khẩu!");
        }
    } catch (err) {
        console.error(err);
        dispatch(loginFail());

        if (err.response) {
            alert(err.response.data.error || "Sai tên đăng nhập hoặc mật khẩu!");
        } else if (err.request) {
            alert("Không thể kết nối đến server. Vui lòng thử lại!");
        } else {
            alert("Đã xảy ra lỗi không xác định!");
        }
    }
};

// ✅ Hàm logout
export const logoutUser = (dispatch, navigate) => {
    // Xóa token
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    // Reset Redux state
    dispatch(logout());
    // Chuyển hướng về login
    navigate("/");
};

export const getUserById = async (id) => {
    try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`http://localhost:8080/drivers/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ API trả về { message, data } → chỉ lấy phần data
        return res.data.data;
    } catch (err) {
        console.error("🚫 Lỗi khi gọi getUserById:", err);
        return null;
    }
};

export const updateUserById = async (id, data) => {
    try {
        const token = localStorage.getItem("accessToken");

        console.log("📤 Gửi PUT:", id, data); // ✅ Debug dữ liệu gửi đi

        const res = await axios.put(`http://localhost:8080/drivers/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("📥 Phản hồi backend:", res.data); // ✅ Xem phản hồi

        return res.data;
    } catch (err) {
        if (err.response) {
            console.error("❌ Backend trả lỗi:", err.response.status, err.response.data);
        } else if (err.request) {
            console.error("⚠️ Không nhận được phản hồi từ server:", err.request);
        } else {
            console.error("🚫 Lỗi không xác định:", err.message);
        }
        return null;
    }
};
// 🟢 1️⃣ Đón học sinh
export const notifyPickedUp = async (driver_id, student_id, bus_id) => {
    try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.post(
            `http://localhost:8080/drivers/notify/picked-up`,
            { driver_id, student_id, bus_id },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("✅ notifyPickedUp:", res.data);
        return res.data;
    } catch (err) {
        console.error("❌ notifyPickedUp error:", err.response?.data || err.message);
        return null;
    }
};

// 🟠 2️⃣ Không đón được học sinh
export const notifyNotPickedUp = async (driver_id, student_id, bus_id, reason) => {
    try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.post(
            `http://localhost:8080/drivers/notify/not-picked-up`,
            { driver_id, student_id, bus_id, reason },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("✅ notifyNotPickedUp:", res.data);
        return res.data;
    } catch (err) {
        console.error("❌ notifyNotPickedUp error:", err.response?.data || err.message);
        return null;
    }
};

// 🔴 3️⃣ Báo sự cố
export const notifyIncident = async (driver_id, bus_id, message) => {
    try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.post(
            `http://localhost:8080/drivers/notify/incident`,
            { driver_id, bus_id, message },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("✅ notifyIncident:", res.data);
        return res.data;
    } catch (err) {
        console.error("❌ notifyIncident error:", err.response?.data || err.message);
        return null;
    }
};


