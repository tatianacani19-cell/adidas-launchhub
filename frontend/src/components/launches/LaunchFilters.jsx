import { Search, X } from "lucide-react";

function LaunchFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    marketFilter,
    onMarketChange,
    onClear,
}) {
    return (
        <div className="filters-container">

            <div className="search-box">
                <Search size={18} />
                <input
                    type="text"
                    placeholder="Search launches"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <select
                value={marketFilter}
                onChange={(e) => onMarketChange(e.target.value)}
            >
                <option>All Markets</option>
                <option>Colombia</option>
                <option>Mexico</option>
                <option>Chile</option>
            </select>

            <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
            >
                <option>All Status</option>
                <option>Draft</option>
                <option>In Review</option>
                <option>Approved</option>
                <option>Published</option>
            </select>

            <button className="clear-btn" onClick={onClear}>
                <X size={16} />
                Clear filters
            </button>

        </div>
    );
}

export default LaunchFilters;