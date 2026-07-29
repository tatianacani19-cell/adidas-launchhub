import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children }) {

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div className="skeleton skeleton-text" style={{ width: 120, height: 20 }} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
