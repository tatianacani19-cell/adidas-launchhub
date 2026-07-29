import mongoose from "mongoose";
import dotenv from "dotenv";
import Launch from "../models/Launch.js";

dotenv.config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const count = await Launch.countDocuments();
        if (count === 0) {
            await Launch.create({
                title: "Ultraboost 2026",
                description: "New running shoe",
                market: "Colombia",
                launchDate: "2026-08-15",
                status: "Draft",
            });
            console.log("Seeded 1 launch");
        } else {
            console.log(`Database already has ${count} launches, skipping seed.`);
        }
    } catch (error) {
        console.error("Seed error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

seed();
