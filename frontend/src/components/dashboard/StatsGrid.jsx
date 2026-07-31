import StatCard from "./StatCard";
import { Rocket, FileText, Clock, CheckCircle, Globe, TrendingUp, MapPin } from "lucide-react";

function StatsGrid({ stats, analytics }) {
    return (
        <div className="stats-grid">

            <StatCard
                title="Total Launches"
                value={stats.total}
                subtitle="All launches"
                icon={Rocket}
            />

            <StatCard
                title="Draft"
                value={stats.draft}
                subtitle="Pending approval"
                icon={FileText}
            />

            <StatCard
                title="In Review"
                value={stats.inReview}
                subtitle="Under review"
                icon={Clock}
            />

            <StatCard
                title="Approved"
                value={stats.approved}
                subtitle="Ready to publish"
                icon={CheckCircle}
            />

            <StatCard
                title="Published"
                value={stats.published}
                subtitle="Live launches"
                icon={Globe}
            />

            {analytics && (
                <>
                    <StatCard
                        title="Completion Rate"
                        value={`${analytics.completionRate}%`}
                        subtitle="Approved + Published"
                        icon={TrendingUp}
                    />

                    <StatCard
                        title="Markets"
                        value={analytics.marketCount}
                        subtitle="Active markets"
                        icon={MapPin}
                    />
                </>
            )}

        </div>
    );
}

export default StatsGrid;