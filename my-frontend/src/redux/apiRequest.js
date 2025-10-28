import axios from "axios";
import { loginFail, loginStart, loginSuccess, logout } from "./authSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("http://localhost:8080/auth/login", user);

        if (res.data.accessToken) {
            dispatch(loginSuccess(res.data));
            localStorage.setItem("accessToken", res.data.accessToken);

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
    // Reset Redux state
    dispatch(logout());
    // Chuyển hướng về login
    navigate("/");
};
