import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import launchRoutes from "./routes/launchRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import { authenticateToken } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "LaunchHub API is running 🚀"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/launches", authenticateToken, launchRoutes);
app.use("/api/launches/:id/assets", assetRoutes);
app.use("/api/calendar", authenticateToken, calendarRoutes);
app.use("/api/users/profile", profileRoutes);
app.use("/api/users", userRoutes);

export default app;
