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
    data.status = "Draft";
    const launch = await Launch.create(data);
    await addActivityLog(launch._id, ACTIVITY_ACTIONS.LAUNCH_CREATED, "Launch created", user);
    return Launch.findById(launch._id);
};

export const updateLaunch = async (id, data, user) => {
    try {
        if (data && typeof data === "object") {
            delete data.status;
        }
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

export const STATUS_FLOW = ["Draft", "In Review", "Approved", "Published"];

export const updateLaunchStatus = async (id, status, user) => {
    const launch = await Launch.findById(id);
    if (!launch) return null;

    const targetIndex = STATUS_FLOW.indexOf(status);

    if (targetIndex === -1) {
        const error = new Error("Invalid status.");
        error.status = 400;
        throw error;
    }

    if (launch.status === status) {
        return launch;
    }

    if (user?.role === "APPROVER" && launch.status !== "In Review") {
        const error = new Error("Approvers can only approve or reject launches that are In Review.");
        error.status = 403;
        throw error;
    }

    if (user?.role === "CREATOR" && !(launch.status === "Draft" && status === "In Review")) {
        const error = new Error("Creators can only submit Draft launches for review.");
        error.status = 403;
        throw error;
    }

    const currentIndex = STATUS_FLOW.indexOf(launch.status);
    const isNextStep = targetIndex === currentIndex + 1;
    const isRevertToDraft = status === "Draft" && launch.status !== "Published";

    if (!isNextStep && !isRevertToDraft) {
        const error = new Error(
            `Cannot change status from "${launch.status}" to "${status}". Status must follow the sequence: ${STATUS_FLOW.join(" → ")}.`
        );
        error.status = 400;
        throw error;
    }

    try {
        const updated = await Launch.findByIdAndUpdate(id, { status }, { new: true });
        if (updated) {
            await addActivityLog(updated._id, ACTIVITY_ACTIONS.LAUNCH_STATUS_CHANGED, `Status changed to ${status}`, user);
            return Launch.findById(id);
        }
        return updated;
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
