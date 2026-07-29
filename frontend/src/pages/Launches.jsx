import { useEffect, useState, useMemo } from "react";
import MainLayout from "../components/layout/MainLayout";

import LaunchHeader from "../components/launches/LaunchHeader";
import LaunchFilters from "../components/launches/LaunchFilters";
import LaunchTable from "../components/launches/LaunchTable";
import Pagination from "../components/launches/Pagination";

import api from "../services/api";

import "../styles/launches.css";

function Launches() {

    const [launches, setLaunches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [marketFilter, setMarketFilter] = useState("All Markets");

    useEffect(() => {
        loadLaunches();
    }, []);

    async function loadLaunches() {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get("/launches");
            setLaunches(response.data);
        } catch (err) {
            console.error("Error loading launches:", err);
            setError("Failed to load launches. Please try again later.");
        } finally {
            setLoading(false);
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

    function handleClearFilters() {
        setSearchTerm("");
        setStatusFilter("All Status");
        setMarketFilter("All Markets");
    }

    const filteredLaunches = useMemo(() => {
        return launches.filter((launch) => {
            const matchesSearch = launch.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesStatus =
                statusFilter === "All Status" || launch.status === statusFilter;
            const matchesMarket =
                marketFilter === "All Markets" || launch.market === marketFilter;
            return matchesSearch && matchesStatus && matchesMarket;
        });
    }, [launches, searchTerm, statusFilter, marketFilter]);

    return (
        <MainLayout title="Launches">
            <LaunchHeader />

            {!loading && !error && launches.length > 0 && (
                <LaunchFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    marketFilter={marketFilter}
                    onMarketChange={setMarketFilter}
                    onClear={handleClearFilters}
                />
            )}

            {loading && <div className="launchs-status">Loading launches...</div>}

            {error && <div className="launchs-status launchs-error">{error}</div>}

            {!loading && !error && (
                <>
                    <LaunchTable
                        launches={filteredLaunches}
                        onDelete={handleDelete}
                    />
                    <Pagination />
                </>
            )}
        </MainLayout>
    );
}

export default Launches;