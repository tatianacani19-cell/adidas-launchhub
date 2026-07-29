import UpcomingLaunches from "./UpcomingLaunches";
import StatusChart from "./StatusChart";
import RecentActivity from "./RecentActivity";
import CalendarPreview from "./CalendarPreview";

function DashboardContent() {
    return (
        <div className="dashboard-content">
            <UpcomingLaunches />
            <StatusChart />
            <RecentActivity />
            <CalendarPreview />
        </div>
    );
}

export default DashboardContent;