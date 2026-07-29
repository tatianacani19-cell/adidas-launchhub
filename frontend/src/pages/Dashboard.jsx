import MainLayout from "../components/layout/MainLayout";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsGrid from "../components/dashboard/StatsGrid";
import DashboardContent from "../components/dashboard/DashboardContent";

function Dashboard() {
    return (
        <MainLayout title="Dashboard">
            <DashboardHeader />

            <StatsGrid />

            <DashboardContent />
        </MainLayout>
    );
}

export default Dashboard;