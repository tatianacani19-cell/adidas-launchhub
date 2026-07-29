import { useEffect, useState, useMemo } from "react";
import MainLayout from "../components/layout/MainLayout";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsGrid from "../components/dashboard/StatsGrid";
import DashboardContent from "../components/dashboard/DashboardContent";

import api from "../services/api";

function Dashboard() {

    const [launches, setLaunches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            setError("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    }

    const stats = useMemo(() => ({
        total: launches.length,
        draft: launches.filter((l) => l.status === "Draft").length,
        inReview: launches.filter((l) => l.status === "In Review").length,
        approved: launches.filter((l) => l.status === "Approved").length,
        published: launches.filter((l) => l.status === "Published").length,
    }), [launches]);

    const byMarket = useMemo(() => {
        const map = {};
        launches.forEach((l) => {
            map[l.market] = (map[l.market] || 0) + 1;
        });
        return map;
    }, [launches]);

    const upcoming = useMemo(() => {
        const today = new Date().toISOString().split("T")[0];
        return launches
            .filter((l) => l.launchDate >= today)
            .sort((a, b) => a.launchDate.localeCompare(b.launchDate))
            .slice(0, 5);
    }, [launches]);

    const recent = useMemo(() => {
        return [...launches]
            .sort((a, b) => b.launchDate.localeCompare(a.launchDate))
            .slice(0, 5);
    }, [launches]);

    if (loading) {
        return (
            <MainLayout title="Dashboard">
                <div className="dashboard-status">Loading dashboard...</div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout title="Dashboard">
                <div className="dashboard-status dashboard-error">{error}</div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Dashboard">
            <DashboardHeader />

            <StatsGrid stats={stats} />

            <DashboardContent
                stats={stats}
                byMarket={byMarket}
                upcoming={upcoming}
                recent={recent}
            />
        </MainLayout>
    );
}

export default Dashboard;