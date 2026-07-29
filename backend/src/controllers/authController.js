import jwt from "jsonwebtoken";
import User from "../models/User.js";
import * as authService from "../services/authService.js";
import { sendResetEmail } from "../services/emailService.js";

const JWT_SECRET = process.env.JWT_SECRET || "launchhub-secret-key";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required." });
        }

        const existing = await authService.findByEmail(email);
        if (existing) {
            return res.status(409).json({ message: "Email already registered." });
        }

        const user = await authService.createUser({ name, email, password });

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await authService.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const validPassword = await authService.validatePassword(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const me = async (req, res) => {
    try {
        const user = await authService.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.error("Me error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        console.log("========================================");
        console.log("Forgot password request received");
        console.log("Searching user:", email);

        if (!email) {
            console.log("No email provided");
            return res.status(400).json({ message: "Email is required." });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        console.log("User found:", user ? user.email : "not found");

        if (!user) {
            console.log("No user with that email — returning generic message");
            console.log("========================================");
            return res.json({ message: "If the email exists, a recovery link has been sent." });
        }

        const crypto = await import("crypto");
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 15 * 60 * 1000);

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expires;
        await user.save();
        console.log("Reset token saved to DB");

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetUrl = `${frontendUrl}/reset-password/${token}`;

        console.log("Reset URL:", resetUrl);
        console.log("Sending email to:", user.email);

        try {
            const info = await sendResetEmail(user.email, token);
            console.log("Email sent:", info.messageId);
        } catch (emailError) {
            console.error("Email sending FAILED:", emailError.message);
            if (emailError.code) console.error("Error code:", emailError.code);
            if (emailError.response) console.error("SMTP response:", emailError.response);
        }

        console.log("========================================");
        res.json({ message: "If the email exists, a recovery link has been sent." });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        const user = await authService.resetPassword(token, password);
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token." });
        }

        res.json({ message: "Password reset successful. You can now log in." });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const testEmail = async (req, res) => {
    try {
        const testAddress = "tatianacani19@gmail.com";
        console.log("========================================");
        console.log("TEST EMAIL endpoint called");
        console.log("Sending test email to:", testAddress);

        const info = await sendResetEmail(testAddress, "test-token-12345");
        console.log("Test email sent:", info.messageId);
        console.log("========================================");

        res.json({
            success: true,
            message: "Test email sent successfully",
            messageId: info.messageId,
        });
    } catch (error) {
        console.error("Test email FAILED:", error.message);
        if (error.code) console.error("Error code:", error.code);
        if (error.response) console.error("SMTP response:", error.response);
        res.status(500).json({
            success: false,
            message: "Failed to send test email",
            error: error.message,
        });
    }
};
