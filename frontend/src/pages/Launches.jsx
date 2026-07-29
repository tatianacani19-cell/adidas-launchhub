import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";

import LaunchHeader from "../components/launches/LaunchHeader";
import LaunchFilters from "../components/launches/LaunchFilters";
import LaunchTable from "../components/launches/LaunchTable";
import Pagination from "../components/launches/Pagination";

import api from "../services/api";

import "../styles/launches.css";

function Launches() {

    const [launches, setLaunches] = useState([]);

    useEffect(() => {
        loadLaunches();
    }, []);

    async function loadLaunches() {
        try {
            const response = await api.get("/launches");
            setLaunches(response.data);
        } catch (error) {
            console.error("Error loading launches:", error);
        }
    }

    async function handleDelete(id) {
        try {
            await api.delete(`/launches/${id}`);
            setLaunches((prev) => prev.filter((launch) => launch.id !== id));
        } catch (error) {
            console.error("Error deleting launch:", error);
        }
    }

    return (
        <MainLayout title="Launches">
            <LaunchHeader />
            <LaunchFilters />
            <LaunchTable launches={launches} onDelete={handleDelete} />
            <Pagination />
        </MainLayout>
    );
}

export default Launches;