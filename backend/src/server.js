import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

process.on("unhandledRejection", (reason, promise) => {
    console.error("[SERVER] Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error) => {
    console.error("[SERVER] Uncaught Exception:", error);
});

console.log("[SERVER] ────────────────────────────────────────");
console.log("[SERVER] Starting LaunchHub backend...");

console.log("[SERVER] Loading environment variables...");
dotenv.config();
console.log("[SERVER] Environment variables loaded");
console.log("[SERVER]   PORT:", process.env.PORT || "(default: 3000)");
console.log("[SERVER]   MONGO_URI:", process.env.MONGO_URI ? "(set)" : "(MISSING)");
console.log("[SERVER]   JWT_SECRET:", process.env.JWT_SECRET ? "(set)" : "(MISSING)");
console.log("[SERVER]   EMAIL_HOST:", process.env.EMAIL_HOST || "(MISSING)");
console.log("[SERVER]   EMAIL_PORT:", process.env.EMAIL_PORT || "(MISSING)");
console.log("[SERVER]   EMAIL_USER:", process.env.EMAIL_USER || "(MISSING)");
console.log("[SERVER]   EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "(set, length=" + process.env.EMAIL_PASSWORD.length + ")" : "(MISSING)");
console.log("[SERVER]   FRONTEND_URL:", process.env.FRONTEND_URL || "(MISSING)");

const PORT = process.env.PORT || 3000;

console.log("[SERVER] Starting Express server...");
const server = app.listen(PORT, () => {
    console.log("[SERVER] Server listening on http://localhost:" + PORT);
    console.log("[SERVER] API base URL: http://localhost:" + PORT + "/api");
    console.log("[SERVER] ────────────────────────────────────────");
});

console.log("[SERVER] Email service initialized (lazy, no blocking verify)");
console.log("[SERVER] Connecting to MongoDB (non-blocking)...");
connectDB()
    .then((connected) => {
        if (connected) {
            console.log("[SERVER] MongoDB Connected");
        } else {
            console.log("[SERVER] WARNING: MongoDB not connected. Database features will be unavailable.");
        }
    })
    .catch((err) => {
        console.error("[SERVER] MongoDB connection error:", err.message);
        console.log("[SERVER] Server continues without database.");
    });
