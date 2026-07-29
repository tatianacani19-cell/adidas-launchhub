import { useEffect, useState, useMemo } from "react";
import MainLayout from "../components/layout/MainLayout";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsGrid from "../components/dashboard/StatsGrid";
import DashboardContent from "../components/dashboard/DashboardContent";
import ErrorState from "../components/common/ErrorState";
import { useToast } from "../context/ToastContext";

import api from "../services/api";

import "../styles/dashboard.css";

function Dashboard() {

    const { addToast } = useToast();
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

    const analytics = useMemo(() => {
        const markets = Object.keys(
            launches.reduce((acc, l) => ({ ...acc, [l.market]: true }), {})
        );
        const completionRate = stats.total > 0
            ? Math.round(((stats.approved + stats.published) / stats.total) * 100)
            : 0;
        const avgPerMarket = markets.length > 0
            ? (stats.total / markets.length).toFixed(1)
            : 0;
        return { marketCount: markets.length, completionRate, avgPerMarket };
    }, [launches, stats]);

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

    function exportDashboardCSV() {
        const headers = ["Title", "Market", "Date", "Status", "Description"];
        const rows = launches.map((l) => [
            l.title, l.market, l.launchDate, l.status, l.description,
        ]);
        const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "dashboard-launches.csv";
        a.click();
        URL.revokeObjectURL(url);
        addToast("Dashboard data exported to CSV.", "info");
    }

    function exportDashboardPDF() {
        window.print();
        addToast("Print dialog opened for PDF export.", "info");
    }

    if (loading) {
        return (
            <MainLayout title="Dashboard">
                <div className="dashboard-status" aria-busy="true">Loading dashboard...</div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout title="Dashboard">
                <ErrorState message={error} onRetry={loadLaunches} />
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Dashboard">
            <DashboardHeader
                onExportCSV={exportDashboardCSV}
                onExportPDF={exportDashboardPDF}
            />

            <StatsGrid stats={stats} analytics={analytics} />

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