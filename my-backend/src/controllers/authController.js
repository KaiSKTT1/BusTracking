
import bcrypt from "bcryptjs";
import crypto from "crypto";
import AuthModel from "../models/AuthModel.js";
import { signAccess, signRefresh, verifyRefresh } from "../utils/jwt.js";

// 🧠 Hàm hash token
// const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// 🟢 LOGIN
let login = async (req, res) => {
    try {
        const { name, email, password, role_id } = req.body;
        const user = await AuthModel.getUserByEmail(email);

        if (!user) return res.status(401).json({ error: "User not found" });

        // const match = await bcrypt.compare(password, user.password);
        const match = password === user.password; // ⚠️ tạm thời, chưa mã hóa
        if (!match) return res.status(401).json({ error: "Wrong password" });
        if (user.role_id !== role_id) {
            return res.status(403).json({ error: "This account does not have permission for this login page" });
        }


        const accessToken = signAccess({
            sub: user.user_id,
            username: user.username,
            email: user.email,
            role_id: user.role_id,
        });

        // 💤 Refresh token (bỏ comment nếu dùng)
        // const refreshToken = signRefresh({ sub: user.id });
        // const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        // await AuthModel.saveRefreshToken(user.id, refreshToken, expiresAt);
        // res.cookie("refreshToken", refreshToken, {
        //   httpOnly: true,
        //   secure: false,
        //   sameSite: "lax",
        //   maxAge: 30 * 24 * 60 * 60 * 1000,
        // });

        return res.json({
            accessToken,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role_id: user.role_id,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

// 🔁 REFRESH TOKEN
let refresh = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "No refresh token" });

    try {
        const payload = verifyRefresh(token);
        const tokenHash = token;
        const valid = await AuthModel.findValidRefreshToken(payload.sub, tokenHash);

        if (!valid) return res.status(401).json({ error: "Invalid refresh token" });

        const newAccess = signAccess({ sub: payload.sub });
        return res.json({ accessToken: newAccess });
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
};

// 🚪 LOGOUT
let logout = async (req, res) => {
    // const token = req.cookies.refreshToken;
    // if (token) {
    //   await AuthModel.deleteRefreshToken(token);
    // }
    res.clearCookie("refreshToken", { httpOnly: true, secure: false, sameSite: "lax" });
    res.json({ ok: true });
};

export default {
    login,
    refresh,
    logout,
};
