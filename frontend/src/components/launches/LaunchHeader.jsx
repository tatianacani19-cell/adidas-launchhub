import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LaunchHeader() {

    const navigate = useNavigate();

    return (

        <div className="launch-header">

            <div>

                <h1>Launches</h1>

                <p>Create, manage and track all product launches.</p>

            </div>

            <button
                className="create-btn"
                onClick={() => navigate("/launches/create")}
            >

                <Plus size={18} />

                Create Launch

            </button>

        </div>

    );

}

export default LaunchHeader;