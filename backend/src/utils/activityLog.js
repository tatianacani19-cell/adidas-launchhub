import Launch from "../models/Launch.js";

export const addActivityLog = async (launchId, action, description, performedBy) => {
    try {
        await Launch.findByIdAndUpdate(launchId, {
            $push: {
                activityLog: {
                    action,
                    description,
                    performedBy: performedBy || {},
                    createdAt: new Date(),
                },
            },
        });
    } catch (error) {
        console.error("Failed to add activity log:", error);
    }
};

export const ACTIVITY_ACTIONS = {
    LAUNCH_CREATED: "LAUNCH_CREATED",
    LAUNCH_UPDATED: "LAUNCH_UPDATED",
    LAUNCH_DELETED: "LAUNCH_DELETED",
    LAUNCH_STATUS_CHANGED: "LAUNCH_STATUS_CHANGED",
    ASSET_UPLOADED: "ASSET_UPLOADED",
    ASSET_DELETED: "ASSET_DELETED",
    PRODUCT_IMAGE_UPLOADED: "PRODUCT_IMAGE_UPLOADED",
    PRODUCT_IMAGE_REPLACED: "PRODUCT_IMAGE_REPLACED",
    PRODUCT_IMAGE_DELETED: "PRODUCT_IMAGE_DELETED",
};