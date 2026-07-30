import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["ADMIN", "CREATOR", "APPROVER"],
        default: "CREATOR",
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    avatar: {
        type: String,
        default: "",
    },
    department: {
        type: String,
        default: "",
    },
    language: {
        type: String,
        default: "en",
    },
    dateFormat: {
        type: String,
        default: "MM/DD/YYYY",
    },
    timeFormat: {
        type: String,
        default: "12h",
    },
    timezone: {
        type: String,
        default: "America/Bogota",
    },
    notifications: {
        emailNotifications: {
            type: Boolean,
            default: true,
        },
        marketingNotifications: {
            type: Boolean,
            default: false,
        },
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;
