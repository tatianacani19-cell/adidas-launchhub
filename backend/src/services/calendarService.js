import Launch from "../models/Launch.js";

const STATUS_MAP = {
    Draft: "Draft",
    "In Review": "Review",
    Approved: "Approve",
    Published: "Launch",
};

export const getCalendarEvents = async () => {
    const launches = await Launch.find({ launchDate: { $exists: true, $ne: "" } })
        .sort({ launchDate: 1 });

    return launches.map((launch) => ({
        id: launch._id.toString(),
        title: launch.title,
        start: launch.launchDate,
        extendedProps: {
            market: launch.market,
            status: STATUS_MAP[launch.status] || "Meeting",
            launchStatus: launch.status,
        },
    }));
};
