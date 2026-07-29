import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password -resetPasswordToken -resetPasswordExpires")
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ message: "Failed to fetch users." });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password -resetPasswordToken -resetPasswordExpires");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(user);
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: "Failed to fetch user." });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required." });
        }

        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(409).json({ message: "Email already registered." });
        }

        const validRoles = ["ADMIN", "CREATOR", "APPROVER"];
        const userRole = validRoles.includes(role) ? role : "CREATOR";

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: userRole,
            status: "active",
        });

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        });
    } catch (error) {
        console.error("Create user error:", error);
        res.status(500).json({ message: "Failed to create user." });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email, role, status } = req.body;
        const updates = {};

        if (name) updates.name = name;
        if (email) updates.email = email.toLowerCase().trim();
        if (role) {
            const validRoles = ["ADMIN", "CREATOR", "APPROVER"];
            if (validRoles.includes(role)) updates.role = role;
        }
        if (status) {
            const validStatuses = ["active", "inactive"];
            if (validStatuses.includes(status)) updates.status = status;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
            .select("-password -resetPasswordToken -resetPasswordExpires");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(user);
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ message: "Failed to update user." });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Failed to delete user." });
    }
};
