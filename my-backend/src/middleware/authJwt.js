import jwt from "jsonwebtoken";

// Middleware xác thực Access Token
export function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "Thiếu token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token không hợp lệ" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT verify error:", err);
        return res.status(403).json({ message: "Access token không hợp lệ hoặc đã hết hạn" });
    }


}
export function isAdmin(req, res, next) {
    if (!req.user || req.user.role !== "Admin") {
        return res.status(403).json({ message: "Chỉ admin mới được phép truy cập" });
    }
    next();
}