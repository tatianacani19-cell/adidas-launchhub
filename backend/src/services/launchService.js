import Launch from "../models/Launch.js";
import { addActivityLog, ACTIVITY_ACTIONS } from "../utils/activityLog.js";

export const getAllLaunches = async (query = {}) => {
    const { search, status, market, date, sortField, sortDir, page, limit = 8 } = query;

    let filter = {};
    if (search) {
        filter.title = { $regex: search, $options: "i" };
    }
    if (status && status !== "All Status") {
        filter.status = status;
    }
    if (market && market !== "All Markets") {
        filter.market = market;
    }
    if (date) {
        filter.launchDate = { $regex: `^${date}` };
    }

    let sort = {};
    if (sortField) {
        sort[sortField] = sortDir === "desc" ? -1 : 1;
    } else {
        sort.createdAt = -1;
    }

    if (page) {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const launches = await Launch.find(filter).sort(sort).skip(skip).limit(limitNum);
        const total = await Launch.countDocuments(filter);

        return {
            launches,
            totalPages: Math.ceil(total / limitNum),
            totalCount: total,
        };
    } else {
        return Launch.find(filter).sort(sort);
    }
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

    const isApproverAction = launch.status === "In Review" || (launch.status === "Approved" && status === "Published");

    if (user?.role === "APPROVER" && !isApproverAction) {
        const error = new Error("Approvers can approve or reject launches that are In Review, or publish Approved launches.");
        error.status = 403;
        throw error;
    }

    const currentIndex = STATUS_FLOW.indexOf(launch.status);

    const isForwardStep = targetIndex === currentIndex + 1;
    const isBackward = targetIndex < currentIndex;

    if (user?.role === "CREATOR") {
        const canSubmitForReview = launch.status === "Draft" && status === "In Review";
        if (!canSubmitForReview && !isBackward) {
            const error = new Error("Creators can submit Draft launches for review or move a launch back a step.");
            error.status = 403;
            throw error;
        }
    }

    if (!isForwardStep && !isBackward) {
        const error = new Error(
            `Cannot change status from "${launch.status}" to "${status}". Move one step forward or back to a previous status.`
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
