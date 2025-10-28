import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("accessToken");

    // ❌ Nếu không có token thì quay về trang login
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // ✅ Nếu có token thì hiển thị nội dung trang
    return children;
};

export default ProtectedRoute;
