// Middleware xác thực Access Token
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    // 🧠 Kiểm tra header có tồn tại không
    if (!authHeader) {
        return res.status(401).json({ message: "Thiếu header Authorization" });
    }

    // 🧩 Kiểm tra định dạng "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ message: "Định dạng token không hợp lệ" });
    }

    const token = parts[1];
    if (!token) {
        return res.status(401).json({ message: "Thiếu access token" });
    }

    try {
        // ✅ Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // ✅ Lưu thông tin user vào request để route dùng được
        req.user = decoded;

        // ✅ Cho phép tiếp tục xử lý
        next();
    } catch (err) {
        console.error("JWT verify error:", err.message);
        return res.status(403).json({
            message: "Access token không hợp lệ hoặc đã hết hạn",
        });
    }
}

export function isAdmin(req, res, next) {
    if (!req.user || req.user.role !== "Admin") {
        return res.status(403).json({ message: "Chỉ admin mới được phép truy cập" });
    }
    next();
}