import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const findByEmail = async (email) => {
    return User.findOne({ email });
};

export const findById = async (id) => {
    return User.findById(id).select("-password");
};

export const createUser = async ({ name, email, password, role }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "Marketing User",
    });
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};

export const validatePassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

export const generateResetToken = async (email) => {
    const user = await User.findOne({ email });
    if (!user) return null;

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    return token;
};

export const findByResetToken = async (token) => {
    return User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
    });
};

export const resetPassword = async (token, newPassword) => {
    const user = await findByResetToken(token);
    if (!user) return null;

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return {
        id: user._id,
        name: user.name,
        email: user.email,
    };
};
