import {
    getAllLaunches,
    getLaunchById as getLaunchByIdService,
    createLaunch,
    updateLaunch,
    deleteLaunch,
    updateLaunchStatus,
    addLaunchComment,
} from "../services/launchService.js";
import Launch from "../models/Launch.js";
import { addActivityLog, ACTIVITY_ACTIONS } from "../utils/activityLog.js";

export const getLaunches = async (req, res) => {
    try {
        const launches = await getAllLaunches(req.query);
        res.json(launches);
    } catch (error) {
        console.error("Error fetching launches:", error);
        res.status(500).json({ message: "Failed to fetch launches." });
    }
};

export const getLaunchById = async (req, res) => {
    try {
        const launch = await getLaunchByIdService(req.params.id);

        if (!launch) {
            return res.status(404).json({ message: "Launch not found" });
        }

        res.json(launch);
    } catch (error) {
        console.error("Error fetching launch:", error);
        res.status(500).json({ message: "Failed to fetch launch." });
    }
};

export const addLaunch = async (req, res) => {
    try {
        const launch = await createLaunch(req.body, req.user);
        res.status(201).json(launch);
    } catch (error) {
        console.error("Error creating launch:", error);
        res.status(500).json({ message: "Failed to create launch." });
    }
};

export const editLaunch = async (req, res) => {
    try {
        const launch = await updateLaunch(req.params.id, req.body, req.user);

        if (!launch) {
            return res.status(404).json({ message: "Launch not found" });
        }

        res.json(launch);
    } catch (error) {
        console.error("Error updating launch:", error);
        res.status(500).json({ message: "Failed to update launch." });
    }
};

export const removeLaunch = async (req, res) => {
    try {
        const launch = await deleteLaunch(req.params.id, req.user);

        if (!launch) {
            return res.status(404).json({ message: "Launch not found" });
        }

        res.json({ message: "Launch deleted" });
    } catch (error) {
        console.error("Error deleting launch:", error);
        res.status(500).json({ message: "Failed to delete launch." });
    }
};

export const updateLaunchStatusController = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required." });
        }

        const launch = await updateLaunchStatus(req.params.id, status, req.user);

        if (!launch) {
            return res.status(404).json({ message: "Launch not found" });
        }

        res.json(launch);
    } catch (error) {
        console.error("Error updating launch status:", error);
        res.status(error.status || 500).json({ message: error.message || "Failed to update launch status." });
    }
};

export const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Comment text is required." });
        }

        const launch = await addLaunchComment(req.params.id, text.trim(), req.user);

        if (!launch) {
            return res.status(404).json({ message: "Launch not found" });
        }

        res.status(201).json(launch);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Failed to add comment." });
    }
};

export const migrateActivityLog = async (req, res) => {
    try {
        const launches = await Launch.find({ activityLog: { $size: 0 } });
        let count = 0;

        for (const launch of launches) {
            await Launch.findByIdAndUpdate(launch._id, {
                $push: {
                    activityLog: {
                        action: ACTIVITY_ACTIONS.LAUNCH_CREATED,
                        description: "Launch created",
                        performedBy: {
                            _id: "",
                            name: launch.owner || "Unknown User",
                        },
                        createdAt: launch.createdAt,
                    },
                },
            });
            count++;
        }

        res.json({ message: `${count} launches migrated.` });
    } catch (error) {
        console.error("Migration error:", error);
        res.status(500).json({ message: "Migration failed." });
    }
};
