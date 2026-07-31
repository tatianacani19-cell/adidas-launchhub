import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import * as authService from "../services/authService.js";
import { sendResetEmail } from "../services/emailService.js";

const JWT_SECRET = process.env.JWT_SECRET || "launchhub-secret-key";

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

        if (user.status === "inactive") {
            return res.status(403).json({ message: "Account is deactivated. Contact an administrator." });
        }

        const validPassword = await authService.validatePassword(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name, role: user.role },
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
            avatar: user.avatar || "",
            department: user.department || "",
            language: user.language || "en",
            dateFormat: user.dateFormat || "MM/DD/YYYY",
            timeFormat: user.timeFormat || "12h",
            timezone: user.timezone || "America/Bogota",
            notifications: user.notifications || {
                emailNotifications: true,
                marketingNotifications: false,
            },
        });
    } catch (error) {
        console.error("Me error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const timestamp = new Date().toISOString();

        console.log("══════════════════════════════════════════");
        console.log(`[${timestamp}] FORGOT PASSWORD REQUEST`);
        console.log(`[${timestamp}] Received email:`, email || "(empty)");
        console.log(`[${timestamp}] Request IP:`, req.ip);
        console.log(`[${timestamp}] Request body keys:`, Object.keys(req.body));

        if (!email) {
            console.log(`[${timestamp}] VALIDATION FAILED: No email provided`);
            console.log("══════════════════════════════════════════");
            return res.status(400).json({ message: "Email is required." });
        }

        const normalizedEmail = email.toLowerCase().trim();
        console.log(`[${timestamp}] Searching MongoDB for email: "${normalizedEmail}"`);

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            console.log(`[${timestamp}] USER NOT FOUND in database for email: "${normalizedEmail}"`);
            return res.status(404).json({ message: "No account found with this email address." });
        }

        console.log(`[${timestamp}] USER FOUND: id=${user._id}, name="${user.name}", email="${user.email}"`);

        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 15 * 60 * 1000);

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expires;
        await user.save();
        console.log(`[${timestamp}] RESET TOKEN SAVED to MongoDB`);
        console.log(`[${timestamp}]   Token (first 16 chars): ${token.substring(0, 16)}...`);
        console.log(`[${timestamp}]   Token length: ${token.length} chars`);
        console.log(`[${timestamp}]   Expires at: ${expires.toISOString()}`);
        console.log(`[${timestamp}]   Time remaining: 15 minutes`);

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetUrl = `${frontendUrl}/reset-password/${token}`;

        console.log(`[${timestamp}] RESET URL GENERATED:`);
        console.log(`[${timestamp}]   ${resetUrl}`);
        console.log(`[${timestamp}] FRONTEND_URL env:`, process.env.FRONTEND_URL || "(using default)");

        console.log(`[${timestamp}] SENDING EMAIL to: ${user.email}`);

        let emailSent = false;
        let emailErrorDetails = null;

        try {
            const info = await sendResetEmail(user.email, token);
            emailSent = true;
            console.log(`[${timestamp}] EMAIL SENT SUCCESSFULLY`);
            console.log(`[${timestamp}]   Message ID: ${info.messageId}`);
            console.log(`[${timestamp}]   Accepted: ${JSON.stringify(info.accepted)}`);
        } catch (emailError) {
            emailErrorDetails = {
                message: emailError.message,
                code: emailError.code,
                response: emailError.response,
            };
            console.error(`[${timestamp}] EMAIL SENDING FAILED`);
            console.error(`[${timestamp}]   Error: ${emailError.message}`);
            if (emailError.code) console.error(`[${timestamp}]   Code: ${emailError.code}`);
            if (emailError.response) console.error(`[${timestamp}]   SMTP response: ${emailError.response}`);
            if (emailError.name) console.error(`[${timestamp}]   Error type: ${emailError.name}`);
        }

        console.log(`[${timestamp}] RESULT SUMMARY:`);
        console.log(`[${timestamp}]   User found: YES`);
        console.log(`[${timestamp}]   Token saved: YES`);
        console.log(`[${timestamp}]   Email sent: ${emailSent ? "YES" : "NO"}`);
        if (emailErrorDetails) {
            console.log(`[${timestamp}]   Email error: ${emailErrorDetails.message}`);
        }
        console.log("══════════════════════════════════════════");

        res.json({ message: "If the email exists, a recovery link has been sent." });
    } catch (error) {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] FORGOT PASSWORD FATAL ERROR:`, error);
        console.error(`[${timestamp}]   Error name:`, error.name);
        console.error(`[${timestamp}]   Error message:`, error.message);
        if (error.stack) console.error(`[${timestamp}]   Stack trace:`, error.stack);
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
