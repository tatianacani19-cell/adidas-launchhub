import {
    getAllLaunches,
    getLaunchById as getLaunchByIdService,
    createLaunch,
    updateLaunch,
    deleteLaunch,
    updateLaunchStatus,
} from "../services/launchService.js";

export const getLaunches = async (req, res) => {
    try {
        const launches = await getAllLaunches();
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
        const validStatuses = ["Draft", "In Review", "Approved", "Published"];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        const launch = await updateLaunchStatus(req.params.id, status, req.user);

        if (!launch) {
            return res.status(404).json({ message: "Launch not found" });
        }

        res.json(launch);
    } catch (error) {
        console.error("Error updating launch status:", error);
        res.status(500).json({ message: "Failed to update launch status." });
    }
};
