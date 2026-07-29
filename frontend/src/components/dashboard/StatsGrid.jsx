import StatCard from "./StatCard";

function StatsGrid({ stats, analytics }) {
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

            {analytics && (
                <>
                    <StatCard
                        title="Completion Rate"
                        value={`${analytics.completionRate}%`}
                        subtitle="Approved + Published"
                    />

                    <StatCard
                        title="Markets"
                        value={analytics.marketCount}
                        subtitle="Active markets"
                    />
                </>
            )}

        </div>
    );
}

export default StatsGrid;