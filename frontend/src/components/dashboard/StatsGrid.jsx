import StatCard from "./StatCard";

function StatsGrid({ stats }) {
    return (
        <div className="stats-grid">

            <StatCard
                title="Total Launches"
                value={stats.total}
                subtitle="All launches"
            />

            <StatCard
                title="Draft"
                value={stats.draft}
                subtitle="Pending approval"
            />

            <StatCard
                title="In Review"
                value={stats.inReview}
                subtitle="Under review"
            />

            <StatCard
                title="Approved"
                value={stats.approved}
                subtitle="Ready to publish"
            />

            <StatCard
                title="Published"
                value={stats.published}
                subtitle="Live launches"
            />

        </div>
    );
}

export default StatsGrid;