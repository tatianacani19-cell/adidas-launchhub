import MainLayout from "../components/layout/MainLayout";
import LaunchForm from "../components/launches/LaunchForm";

function CreateLaunch() {

    return (

        <MainLayout title="Create Launch">

            <LaunchForm mode="create" />

        </MainLayout>

    );

}

export default CreateLaunch;