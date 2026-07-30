import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "launchhub-secret-key";

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access token required." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("role status");

        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }

        if (user.status === "inactive") {
            return res.status(403).json({ message: "Account is deactivated." });
        }

        req.user = { ...decoded, role: user.role, status: user.status };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            const roleList = roles.join(", ");
            return res.status(403).json({ message: `Access denied. Required role: ${roleList}.` });
        }
        next();
    };
};
