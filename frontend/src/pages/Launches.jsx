import MainLayout from "../components/layout/MainLayout";

import LaunchHeader from "../components/launches/LaunchHeader";
import LaunchFilters from "../components/launches/LaunchFilters";
import LaunchTable from "../components/launches/LaunchTable";
import Pagination from "../components/launches/Pagination";

import "../styles/launches.css";

function Launches() {
    return (
        <MainLayout title="Launches">
            <LaunchHeader />
            <LaunchFilters />
            <LaunchTable />
            <Pagination />
        </MainLayout>
    );
}

export default Launches;