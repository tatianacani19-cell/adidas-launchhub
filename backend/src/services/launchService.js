import Launch from "../models/Launch.js";

export const getAllLaunches = async () => {
    return Launch.find().sort({ createdAt: -1 });
};

export const getLaunchById = async (id) => {
    try {
        return await Launch.findById(id);
    } catch {
        return null;
    }
};

export const createLaunch = async (data) => {
    return Launch.create(data);
};

export const updateLaunch = async (id, data) => {
    try {
        return await Launch.findByIdAndUpdate(id, data, { new: true });
    } catch {
        return null;
    }
};

export const deleteLaunch = async (id) => {
    try {
        return await Launch.findByIdAndDelete(id);
    } catch {
        return null;
    }
};
