import axios from "axios";
import { loginFail, loginStart, loginSuccess } from "./authSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("http://localhost:8080/auth/login", user);


        if (res.data.accessToken) {
            dispatch(loginSuccess(res.data));
            localStorage.setItem("accessToken", res.data.accessToken);

            // ✅ Giải mã role_id từ token hoặc từ response
            const roleId = res.data.role_id || res.data.user?.role_id;

            // ✅ Điều hướng theo role_id
            switch (roleId) {
                case 1: // admin
                    navigate("/admin/dashboard");
                    break;
                case 2: // driver
                    navigate("/driver/pickupdropoff");
                    break;
                case 3: // guardian
                    navigate("/guardian/home");
                    break;
                default:
                    navigate("/"); // fallback
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
