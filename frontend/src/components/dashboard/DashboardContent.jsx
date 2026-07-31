import StatusChart from "./StatusChart";
import MarketChart from "./MarketChart";
import UpcomingLaunches from "./UpcomingLaunches";
import RecentLaunches from "./RecentLaunches";
import RecentActivity from "./RecentActivity";
import CalendarPreview from "./CalendarPreview";

function DashboardContent({ stats, byMarket, upcoming, recent, recentActivities }) {
    return (
        <div className="dashboard-content">
            <StatusChart stats={stats} />
            <MarketChart byMarket={byMarket} />
            <UpcomingLaunches launches={upcoming} />
            <RecentLaunches launches={recent} />
            <RecentActivity activities={recentActivities} />
            <CalendarPreview />
        </div>
    );
}

export default DashboardContent;