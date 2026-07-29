import mongoose from "mongoose";

export async function connectDB() {
    try {
        console.log("[DB] Attempting to connect to MongoDB...");
        console.log("[DB]   URI:", process.env.MONGO_URI ? "(set)" : "(MISSING)");

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log("[DB] MongoDB Connected successfully");
        return true;
    } catch (error) {
        console.error("[DB] MongoDB connection failed:", error.message);
        console.error("[DB] Server will continue without database. Some features may be unavailable.");
        return false;
    }
}
