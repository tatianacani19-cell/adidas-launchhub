import Launch from "../models/Launch.js";

export const addActivityLog = async (launchId, action, description, performedBy) => {
    try {
        await Launch.findByIdAndUpdate(launchId, {
            $push: {
                activityLog: {
                    action,
                    description,
                    performedBy: {
                        _id: performedBy?.id || performedBy?._id || "",
                        name: performedBy?.name || "Unknown User",
                    },
                    createdAt: new Date(),
                },
            },
        });
    } catch (error) {
        console.error("Failed to add activity log:", error);
    }
};

export const ACTIVITY_ACTIONS = {
    LAUNCH_CREATED: "Launch Created",
    LAUNCH_UPDATED: "Launch Updated",
    LAUNCH_DELETED: "Launch Deleted",
    LAUNCH_STATUS_CHANGED: "Status Changed",
    ASSET_UPLOADED: "Asset Uploaded",
    ASSET_DELETED: "Asset Deleted",
    PRODUCT_IMAGE_UPLOADED: "Product Image Uploaded",
    PRODUCT_IMAGE_REPLACED: "Product Image Replaced",
    PRODUCT_IMAGE_DELETED: "Product Image Deleted",
    COMMENT_ADDED: "Comment Added",
};