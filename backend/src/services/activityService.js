import Launch from "../models/Launch.js";

const ACTION_TYPES = {
    LAUNCH_CREATED: "Launch Created",
    LAUNCH_UPDATED: "Launch Updated",
    STATUS_CHANGED: "Status Changed",
    ASSET_UPLOADED: "Asset Uploaded",
    ASSET_DELETED: "Asset Deleted",
    PRODUCT_IMAGE_UPDATED: "Product Image Updated",
    PRODUCT_IMAGE_DELETED: "Product Image Deleted",
    LAUNCH_APPROVED: "Launch Approved",
    LAUNCH_PUBLISHED: "Launch Published",
    LAUNCH_ARCHIVED: "Launch Archived",
};

export const logActivity = async (launchId, action, description, performedBy) => {
    try {
        const launch = await Launch.findById(launchId);
        if (!launch) {
            console.warn(`Launch ${launchId} not found for activity logging`);
            return;
        }

        const activity = {
            action,
            description,
            performedBy: {
                _id: performedBy?.id || performedBy?._id || "",
                name: performedBy?.name || "Unknown User",
            },
            createdAt: new Date(),
        };

        if (!launch.activityLog) {
            launch.activityLog = [];
        }

        launch.activityLog.push(activity);
        await launch.save();
    } catch (error) {
        console.error("Error logging activity:", error);
    }
};

export const ACTION_TYPES;