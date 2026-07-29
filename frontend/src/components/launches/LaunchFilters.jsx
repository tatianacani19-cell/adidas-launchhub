import { Search, X } from "lucide-react";

function LaunchFilters() {
    return (
        <div className="filters-container">

            <div className="search-box">
                <Search size={18} />
                <input
                    type="text"
                    placeholder="Search launches"
                />
            </div>

            <select>
                <option>All Markets</option>
                <option>Colombia</option>
                <option>Mexico</option>
                <option>Chile</option>
            </select>

            <select>
                <option>All Status</option>
                <option>Draft</option>
                <option>In Review</option>
                <option>Approved</option>
                <option>Published</option>
            </select>

            <select>
                <option>All Users</option>
                <option>Tatiana C.</option>
                <option>Daniel H.</option>
            </select>

            <button className="clear-btn">
                <X size={16} />
                Clear filters
            </button>

        </div>
    );
}

export default LaunchFilters;