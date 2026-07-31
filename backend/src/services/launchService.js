import Launch from "../models/Launch.js";
import { addActivityLog, ACTIVITY_ACTIONS } from "../utils/activityLog.js";

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

export const createLaunch = async (data, user) => {
    const launch = await Launch.create(data);
    await addActivityLog(launch._id, ACTIVITY_ACTIONS.LAUNCH_CREATED, "Launch created", user);
    return Launch.findById(launch._id);
};

export const updateLaunch = async (id, data, user) => {
    try {
        const launch = await Launch.findByIdAndUpdate(id, data, { new: true });
        if (launch) {
            await addActivityLog(launch._id, ACTIVITY_ACTIONS.LAUNCH_UPDATED, "Launch details updated", user);
            return Launch.findById(id);
        }
        return launch;
    } catch {
        return null;
    }
};

export const deleteLaunch = async (id, user) => {
    try {
        await addActivityLog(id, ACTIVITY_ACTIONS.LAUNCH_DELETED, "Launch deleted", user);
        return await Launch.findByIdAndDelete(id);
    } catch {
        return null;
    }
};

export const updateLaunchStatus = async (id, status, user) => {
    try {
        const launch = await Launch.findByIdAndUpdate(id, { status }, { new: true });
        if (launch) {
            await addActivityLog(launch._id, ACTIVITY_ACTIONS.LAUNCH_STATUS_CHANGED, `Status changed to ${status}`, user);
            return Launch.findById(id);
        }
        return launch;
    } catch {
        return null;
    }
};

export const addLaunchComment = async (id, text, user) => {
    try {
        const comment = {
            author: user?.name || "Unknown User",
            authorId: user?.id || user?._id || "",
            text,
            createdAt: new Date(),
        };
        const launch = await Launch.findByIdAndUpdate(id, { $push: { comments: comment } }, { new: true });
        if (launch) {
            await addActivityLog(launch._id, ACTIVITY_ACTIONS.COMMENT_ADDED, "Comment added", user);
            return Launch.findById(id);
        }
        return launch;
    } catch {
        return null;
    }
};
