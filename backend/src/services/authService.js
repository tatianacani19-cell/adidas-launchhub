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
