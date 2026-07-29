import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import LaunchForm from "../components/launches/LaunchForm";

import api from "../services/api";

function EditLaunch() {

    const { id } = useParams();

    const [launch, setLaunch] = useState(null);

    useEffect(() => {

        loadLaunch();

    }, []);

    const loadLaunch = async () => {

        try {

            const response = await api.get(`/launches/${id}`);

            setLaunch(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    if (!launch) {

        return (
            <MainLayout title="Edit Launch">
                <p>Loading...</p>
            </MainLayout>
        );

    }

    return (

        <MainLayout title="Edit Launch">

            <LaunchForm
                mode="edit"
                initialData={launch}
            />

        </MainLayout>

    );

}

export default EditLaunch;