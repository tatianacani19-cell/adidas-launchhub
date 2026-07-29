import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { verifyEmailConnection } from "./services/emailService.js";

dotenv.config();

await connectDB();

await verifyEmailConnection();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});