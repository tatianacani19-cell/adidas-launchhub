import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password -resetPasswordToken -resetPasswordExpires");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(user);
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Failed to fetch profile." });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const allowed = [
            "name", "email", "department", "avatar", "language",
            "dateFormat", "timeFormat", "timezone", "notifications",
        ];

        const updates = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        if (updates.email) {
            updates.email = updates.email.toLowerCase().trim();
            const existing = await User.findOne({ email: updates.email, _id: { $ne: req.user.id } });
            if (existing) {
                return res.status(409).json({ message: "Email already in use." });
            }
        }

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true })
            .select("-password -resetPasswordToken -resetPasswordExpires");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(user);
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Failed to update profile." });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All password fields are required." });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "New password must be at least 8 characters." });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const valid = await bcrypt.compare(currentPassword, user.password);
        if (!valid) {
            return res.status(400).json({ message: "Current password is incorrect." });
        }

        const same = await bcrypt.compare(newPassword, user.password);
        if (same) {
            return res.status(400).json({ message: "New password must be different from current password." });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: "Failed to change password." });
    }
};
