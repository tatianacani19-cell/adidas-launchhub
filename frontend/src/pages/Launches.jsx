import { useEffect, useState, useMemo, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";

import LaunchHeader from "../components/launches/LaunchHeader";
import LaunchFilters from "../components/launches/LaunchFilters";
import LaunchTable from "../components/launches/LaunchTable";
import Pagination from "../components/launches/Pagination";
import ConfirmModal from "../components/common/ConfirmModal";
import ErrorState from "../components/common/ErrorState";
import { SkeletonRow } from "../components/common/Skeleton";
import { useToast } from "../context/ToastContext";

import api from "../services/api";

import "../styles/launches.css";

const ITEMS_PER_PAGE = 8;

function Launches() {

    const { addToast } = useToast();

    const [launches, setLaunches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [marketFilter, setMarketFilter] = useState("All Markets");

    const [sortField, setSortField] = useState("title");
    const [sortDir, setSortDir] = useState("asc");

    const [currentPage, setCurrentPage] = useState(1);

    const [deleteTarget, setDeleteTarget] = useState(null);

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

    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return;
        try {
            await api.delete(`/launches/${deleteTarget.id}`);
            setLaunches((prev) => prev.filter((l) => l.id !== deleteTarget.id));
            addToast("Launch deleted successfully.", "success");
        } catch (err) {
            console.error("Error deleting launch:", err);
            addToast("Failed to delete launch.", "error");
        } finally {
            setDeleteTarget(null);
        }
    }, [deleteTarget, addToast]);

    function handleSort(field) {
        if (sortField === field) {
            setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDir("asc");
        }
        setCurrentPage(1);
    }

    function handleClearFilters() {
        setSearchTerm("");
        setStatusFilter("All Status");
        setMarketFilter("All Markets");
        setCurrentPage(1);
    }

    const filteredLaunches = useMemo(() => {
        let result = launches.filter((launch) => {
            const matchesSearch = launch.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesStatus =
                statusFilter === "All Status" || launch.status === statusFilter;
            const matchesMarket =
                marketFilter === "All Markets" || launch.market === marketFilter;
            return matchesSearch && matchesStatus && matchesMarket;
        });

        result.sort((a, b) => {
            const aVal = a[sortField] || "";
            const bVal = b[sortField] || "";
            const cmp = aVal.localeCompare(bVal);
            return sortDir === "asc" ? cmp : -cmp;
        });

        return result;
    }, [launches, searchTerm, statusFilter, marketFilter, sortField, sortDir]);

    const totalPages = Math.ceil(filteredLaunches.length / ITEMS_PER_PAGE);
    const paginatedLaunches = filteredLaunches.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    function exportCSV() {
        const headers = ["Title", "Market", "Date", "Status", "Description"];
        const rows = filteredLaunches.map((l) => [
            l.title, l.market, l.launchDate, l.status, l.description,
        ]);
        const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "launches.csv";
        a.click();
        URL.revokeObjectURL(url);
        addToast("CSV exported successfully.", "info");
    }

    function exportPDF() {
        window.print();
        addToast("Print dialog opened for PDF export.", "info");
    }

    return (
        <MainLayout title="Launches">
            <a href="#launches-table" className="skip-link">Skip to table</a>

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
                    onExportCSV={exportCSV}
                    onExportPDF={exportPDF}
                />
            )}

            {loading && (
                <table className="launch-table" aria-busy="true" aria-label="Loading launches">
                    <thead>
                        <tr>
                            <th></th><th></th><th>Launch</th><th>Market</th>
                            <th>Date</th><th>Status</th><th>Owner</th>
                            <th>Last Updated</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <SkeletonRow key={i} />
                        ))}
                    </tbody>
                </table>
            )}

            {error && <ErrorState message={error} onRetry={loadLaunches} />}

            {!loading && !error && (
                <>
                    <LaunchTable
                        id="launches-table"
                        launches={paginatedLaunches}
                        sortField={sortField}
                        sortDir={sortDir}
                        onSort={handleSort}
                        onDelete={(launch) => setDeleteTarget(launch)}
                    />
                    {filteredLaunches.length > ITEMS_PER_PAGE && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}

            <ConfirmModal
                open={!!deleteTarget}
                title="Delete Launch"
                message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </MainLayout>
    );
}

export default Launches;