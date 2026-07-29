import {
    getAllLaunches,
    getLaunchById as getLaunchByIdService,
    createLaunch,
    updateLaunch,
    deleteLaunch
} from "../services/launchService.js";

export const getLaunches = (req, res) => {
    res.json(getAllLaunches());
};

export const addLaunch = (req, res) => {
    const launch = createLaunch(req.body);
    res.status(201).json(launch);
};

export const editLaunch = (req, res) => {
    const launch = updateLaunch(req.params.id, req.body);

    if (!launch) {
        return res.status(404).json({
            message: "Launch not found"
        });
    }

    res.json(launch);
};

export const removeLaunch = (req, res) => {
    deleteLaunch(req.params.id);

    res.json({
        message: "Launch deleted"
    });
};

export const getLaunchById = (req, res) => {

    const launch = getLaunchByIdService(req.params.id);

    if (!launch) {

        return res.status(404).json({
            message: "Launch not found"
        });

    }

    res.json(launch);

};