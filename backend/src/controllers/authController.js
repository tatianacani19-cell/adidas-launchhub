import jwt from "jsonwebtoken";
import * as authService from "../services/authService.js";

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
