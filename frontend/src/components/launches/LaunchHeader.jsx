import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LaunchHeader() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const canCreate = user?.role === "CREATOR" || user?.role === "ADMIN";

    return (

        <div className="launch-header">

            <div>

                <h1>Launches</h1>

                <p>Create, manage and track all product launches.</p>

            </div>

            {canCreate && (
                <button
                    className="create-btn"
                    onClick={() => navigate("/launches/create")}
                >

                    <Plus size={18} />

                    Create Launch

                </button>
            )}

        </div>

    );

}

export default LaunchHeader;
