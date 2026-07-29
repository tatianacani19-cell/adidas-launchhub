import StatCard from "./StatCard";

function StatsGrid() {
    return (
        <div className="stats-grid">

            <StatCard
                title="Drafts"
                value={4}
                subtitle="Pending approval"
            />

            <StatCard
                title="In Review"
                value={3}
                subtitle="Pending approval"
            />

            <StatCard
                title="Approved"
                value={7}
                subtitle="Ready to publish"
            />

            <StatCard
                title="Published"
                value={12}
                subtitle="Live launches"
            />

        </div>
    );
}

export default StatsGrid;