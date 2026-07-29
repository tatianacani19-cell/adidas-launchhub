import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import launchRoutes from "./routes/launchRoutes.js";
import { authenticateToken } from "./middleware/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "LaunchHub API is running 🚀"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/launches", authenticateToken, launchRoutes);

export default app;