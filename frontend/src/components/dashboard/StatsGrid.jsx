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
                iconBg="#FEE2E2"
                iconColor="#991B1B"
            />

            <StatCard
                title="In Review"
                value={stats.inReview}
                subtitle="Under review"
                icon={Clock}
                iconBg="#FEF9C3"
                iconColor="#92400E"
            />

            <StatCard
                title="Approved"
                value={stats.approved}
                subtitle="Ready to publish"
                icon={CheckCircle}
                iconBg="#DCFCE7"
                iconColor="#166534"
            />

            <StatCard
                title="Published"
                value={stats.published}
                subtitle="Live launches"
                icon={Globe}
                iconBg="#DBEAFE"
                iconColor="#1E40AF"
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