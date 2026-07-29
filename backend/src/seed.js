import mongoose from "mongoose";
import dotenv from "dotenv";
import Launch from "./models/Launch.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const launchCount = await Launch.countDocuments();
        if (launchCount === 0) {
            await Launch.create({
                title: "Ultraboost 2026",
                description: "New running shoe",
                market: "Colombia",
                launchDate: "2026-08-15",
                status: "Draft",
            });
            console.log("Seeded 1 launch");
        } else {
            console.log(`Database already has ${launchCount} launches, skipping seed.`);
        }

        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const hashedPassword = await bcrypt.hash("password123", 10);
            await User.insertMany([
                {
                    name: "Tatiana C.",
                    email: "tatianacani19@gmail.com",
                    password: hashedPassword,
                    role: "ADMIN",
                    status: "active",
                },
                {
                    name: "Daniel H.",
                    email: "daniel@adidas.com",
                    password: hashedPassword,
                    role: "CREATOR",
                    status: "active",
                },
            ]);
            console.log("Seeded 2 users (1 ADMIN, 1 CREATOR)");
        } else {
            console.log(`Database already has ${userCount} users, skipping seed.`);
        }
    } catch (error) {
        console.error("Seed error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

seed();
