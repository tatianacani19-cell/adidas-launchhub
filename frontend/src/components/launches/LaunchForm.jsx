import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TextInput from "../forms/TextInput";
import SelectInput from "../forms/SelectInput";
import TextArea from "../forms/TextArea";
import DateInput from "../forms/DateInput";

import api from "../../services/api";

import "../../styles/createLaunch.css";

function LaunchForm({ mode = "create", initialData = null }) {

    const navigate = useNavigate();

    const [form, setForm] = useState(
        initialData || {
            title: "",
            description: "",
            market: "Colombia",
            launchDate: "",
            status: "Draft"
        }
    );
    useEffect(() => {

        if (mode === "edit" && initialData) {

            setForm(initialData);

        }

    }, [mode, initialData]);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async () => {

        try {

            if (mode === "create") {

                await api.post("/launches", form);

            } else {

                await api.put(`/launches/${form.id}`, form);

            }

            navigate("/launches");

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <div className="create-launch-page">

            <div className="form-card">

                <h1>
                    {mode === "create"
                        ? "Create Launch"
                        : "Edit Launch"}
                </h1>

                <p>
                    Fill in the details below.
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
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate("/launches")}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="save-btn"
                        onClick={handleSubmit}
                    >
                        {mode === "create"
                            ? "Save Launch"
                            : "Update Launch"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default LaunchForm;