import express from "express";
import cors from "cors";
import launchRoutes from "./routes/launchRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "LaunchHub API is running 🚀"
    });
});

app.use("/api/launches", launchRoutes);

export default app;