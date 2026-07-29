import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import TextInput from "../components/forms/TextInput";
import SelectInput from "../components/forms/SelectInput";
import TextArea from "../components/forms/TextArea";
import DateInput from "../components/forms/DateInput";

import api from "../services/api";

import "../styles/createLaunch.css";

function CreateLaunch() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        market: "Colombia",
        launchDate: "",
        status: "Draft"
    });

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const saveLaunch = async () => {

        try {

            await api.post("/launches", form);

            navigate("/launches");

        } catch (error) {

            console.error(error);

            alert("Error saving launch");

        }

    };

    return (

        <MainLayout title="Create Launch">

            <div className="create-launch-page">

                <div className="form-card">

                    <h1>Create Launch</h1>

                    <p>
                        Fill in the details below to create a new product launch.
                    </p>

                    <TextInput
                        label="Title"
                        name="title"
                        placeholder="Launch title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                    <SelectInput
                        label="Market"
                        name="market"
                        value={form.market}
                        onChange={handleChange}
                        options={[
                            "Colombia",
                            "Mexico",
                            "Chile",
                            "Argentina"
                        ]}
                        required
                    />

                    <TextArea
                        label="Description"
                        name="description"
                        placeholder="Describe the launch..."
                        value={form.description}
                        onChange={handleChange}
                        required
                    />

                    <DateInput
                        label="Launch Date"
                        name="launchDate"
                        value={form.launchDate}
                        onChange={handleChange}
                        required
                    />

                    <SelectInput
                        label="Status"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        options={[
                            "Draft",
                            "In Review",
                            "Approved",
                            "Published"
                        ]}
                    />

                    <div className="form-buttons">

                        <button
                            className="cancel-btn"
                            type="button"
                            onClick={() => navigate("/launches")}
                        >
                            Cancel
                        </button>

                        <button
                            className="save-btn"
                            type="button"
                            onClick={saveLaunch}
                        >
                            Save Launch
                        </button>

                    </div>

                </div>

            </div>

        </MainLayout>

    );

}

export default CreateLaunch;