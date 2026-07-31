import { useEffect, useState, useCallback } from "react";
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
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [marketFilter, setMarketFilter] = useState("All Markets");
    const [dateFilter, setDateFilter] = useState("");

    const [sortField, setSortField] = useState("title");
    const [sortDir, setSortDir] = useState("asc");

    const [currentPage, setCurrentPage] = useState(1);

    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, marketFilter, dateFilter, sortField, sortDir]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadLaunches();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [currentPage, searchTerm, statusFilter, marketFilter, dateFilter, sortField, sortDir]);

    async function loadLaunches() {
        try {
            setLoading(true);
            setError(null);
            const params = {
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                search: searchTerm,
                status: statusFilter,
                market: marketFilter,
                date: dateFilter,
                sortField,
                sortDir
            };
            const response = await api.get("/launches", { params });
            setLaunches(response.data.launches || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            console.error("Error loading launches:", err);
            setError("Failed to load launches. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = useCallback(async (id, status) => {
        const response = await api.put(`/launches/${id}/status`, { status });
        setLaunches((prev) =>
            prev.map((l) => (l._id === id ? { ...l, status: response.data?.status || status } : l))
        );
    }, []);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await api.delete(`/launches/${deleteTarget._id}`);
            addToast("Launch deleted successfully.", "success");
            loadLaunches();
        } catch (err) {
            console.error("Error deleting launch:", err);
            addToast("Failed to delete launch.", "error");
        } finally {
            setDeleteTarget(null);
        }
    };

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
        setDateFilter("");
        setCurrentPage(1);
    }

    async function exportCSV() {
        try {
            const params = {
                search: searchTerm,
                status: statusFilter,
                market: marketFilter,
                date: dateFilter,
                sortField,
                sortDir
            };
            const response = await api.get("/launches", { params });
            const allFiltered = response.data;
            
            const headers = ["Title", "Market", "Date", "Status", "Description"];
            const rows = allFiltered.map((l) => [
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
        } catch (err) {
            console.error("Error exporting CSV:", err);
            addToast("Failed to export CSV.", "error");
        }
    }

    function exportPDF() {
        window.print();
        addToast("Print dialog opened for PDF export.", "info");
    }

    const hasFilters = searchTerm || statusFilter !== "All Status" || marketFilter !== "All Markets" || dateFilter;

    return (
        <MainLayout title="Launches">
            <a href="#launches-table" className="skip-link">Skip to table</a>

            <LaunchHeader />

            {!loading && !error && (launches.length > 0 || hasFilters) && (
                <LaunchFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    marketFilter={marketFilter}
                    onMarketChange={setMarketFilter}
                    dateFilter={dateFilter}
                    onDateChange={setDateFilter}
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
                        launches={launches}
                        sortField={sortField}
                        sortDir={sortDir}
                        onSort={handleSort}
                        onDelete={(launch) => setDeleteTarget(launch)}
                        onStatusChange={handleStatusChange}
                    />
                    {totalPages > 1 && (
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