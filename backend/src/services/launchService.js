let launches = [
    {
        id: 1,
        title: "Ultraboost 2026",
        description: "New running shoe",
        market: "Colombia",
        launchDate: "2026-08-15",
        status: "Draft"
    }
];

export const getAllLaunches = () => launches;
export const getLaunchById = (id) => {

    return launches.find(launch => launch.id == id);

};

export const createLaunch = (launch) => {
    const newLaunch = {
        id: launches.length + 1,
        ...launch
    };

    launches.push(newLaunch);

    return newLaunch;
};

export const updateLaunch = (id, data) => {
    const index = launches.findIndex(l => l.id == id);

    if (index === -1) return null;

    launches[index] = {
        ...launches[index],
        ...data
    };

    return launches[index];
};

export const deleteLaunch = (id) => {
    launches = launches.filter(l => l.id != id);
};