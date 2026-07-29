import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import LaunchRow from "./LaunchRow";
import EmptyState from "../common/EmptyState";

function SortIcon({ field, sortField, sortDir }) {
    if (field !== sortField) return <ChevronsUpDown size={14} />;
    return sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
}

function LaunchTable({ launches, sortField, sortDir, onSort, onDelete, ...props }) {

    if (launches.length === 0) {
        return <EmptyState title="No launches found" message="Try adjusting your search or filters." />;
    }

    const columns = [
        { key: "title", label: "Launch", sortable: true },
        { key: "market", label: "Market", sortable: true },
        { key: "launchDate", label: "Date", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "owner", label: "Owner", sortable: false },
        { key: "updated", label: "Last Updated", sortable: false },
    ];

    return (
        <table className="launch-table" role="grid" {...props}>

            <thead>
                <tr>
                    <th style={{ width: 40 }}></th>
                    <th style={{ width: 50 }}></th>
                    {columns.map((col) => (
                        <th
                            key={col.key}
                            onClick={col.sortable ? () => onSort(col.key) : undefined}
                            className={col.sortable ? "sortable-th" : ""}
                            aria-sort={sortField === col.key ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                        >
                            <span className="th-content">
                                {col.label}
                                {col.sortable && <SortIcon field={col.key} sortField={sortField} sortDir={sortDir} />}
                            </span>
                        </th>
                    ))}
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {launches.map((launch) => (
                    <LaunchRow
                        key={launch._id}
                        launch={{
                            ...launch,
                            owner: launch.owner || "Marketing Team",
                            updated: launch.updated || "-",
                        }}
                        onDelete={onDelete}
                    />
                ))}
            </tbody>

        </table>
    );
}

export default LaunchTable;