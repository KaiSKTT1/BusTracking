import pool from "./configs/connectDB.js";

const testConnection = async () => {
    try {
        const [rows] = await pool.query("SELECT 1 + 1 AS result");
        console.log("Database connected! Test query result:", rows[0].result);
    } catch (err) {
        console.error("Database connection failed:", err.message);
    }
};

testConnection();
