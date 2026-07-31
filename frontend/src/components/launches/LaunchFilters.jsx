import { Search, X, Download, FileText, Calendar } from "lucide-react";

function LaunchFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    marketFilter,
    onMarketChange,
    dateFilter,
    onDateChange,
    onClear,
    onExportCSV,
    onExportPDF,
}) {
    return (
        <div className="filters-container" role="search" aria-label="Filter launches">

            <div className="search-box">
                <Search size={18} />
                <input
                    type="text"
                    placeholder="Search launches"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    aria-label="Search launches by title"
                />
            </div>

            <select
                value={marketFilter}
                onChange={(e) => onMarketChange(e.target.value)}
                aria-label="Filter by market"
            >
                <option>All Markets</option>
                <option>Colombia</option>
                <option>Mexico</option>
                <option>Chile</option>
            </select>

            <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                aria-label="Filter by status"
            >
                <option>All Status</option>
                <option>Draft</option>
                <option>In Review</option>
                <option>Approved</option>
                <option>Published</option>
            </select>

            <div className="date-filter">
                <Calendar size={16} />
                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => onDateChange(e.target.value)}
                    aria-label="Filter by launch date"
                />
            </div>

            <button className="clear-btn" onClick={onClear} aria-label="Clear all filters">
                <X size={16} />
                Clear filters
            </button>

            <div className="export-group">
                <button className="export-btn" onClick={onExportCSV} aria-label="Export to CSV">
                    <Download size={16} />
                    CSV
                </button>
                <button className="export-btn" onClick={onExportPDF} aria-label="Export to PDF">
                    <FileText size={16} />
                    PDF
                </button>
            </div>

        </div>
    );
}

export default LaunchFilters;