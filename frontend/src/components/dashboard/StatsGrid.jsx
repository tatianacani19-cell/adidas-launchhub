import StatCard from "./StatCard";
import { Rocket, FileText, Clock, CheckCircle, Globe, TrendingUp, MapPin } from "lucide-react";

function StatsGrid({ stats, analytics, selectedStatus, onStatusSelect }) {
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
                active={selectedStatus === "Draft"}
                onClick={() => onStatusSelect(selectedStatus === "Draft" ? null : "Draft")}
            />

            <StatCard
                title="In Review"
                value={stats.inReview}
                subtitle="Under review"
                icon={Clock}
                iconBg="#FEF9C3"
                iconColor="#92400E"
                active={selectedStatus === "In Review"}
                onClick={() => onStatusSelect(selectedStatus === "In Review" ? null : "In Review")}
            />

            <StatCard
                title="Approved"
                value={stats.approved}
                subtitle="Ready to publish"
                icon={CheckCircle}
                iconBg="#DCFCE7"
                iconColor="#166534"
                active={selectedStatus === "Approved"}
                onClick={() => onStatusSelect(selectedStatus === "Approved" ? null : "Approved")}
            />

            <StatCard
                title="Published"
                value={stats.published}
                subtitle="Live launches"
                icon={Globe}
                iconBg="#DBEAFE"
                iconColor="#1E40AF"
                active={selectedStatus === "Published"}
                onClick={() => onStatusSelect(selectedStatus === "Published" ? null : "Published")}
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