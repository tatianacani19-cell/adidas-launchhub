import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MoreVertical, Edit3, Trash2, FileText, MessageCircle } from "lucide-react";

import MainLayout from "../components/layout/MainLayout";
import StatusBadge from "../components/launches/StatusBadge";
import CategoryBadge from "../components/launches/CategoryBadge";
import { formatDateTime } from "../utils/formatDateTime";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

import "../styles/launchDetail.css";

const STATUS_ORDER = ["Draft", "In Review", "Approved", "Published"];

function LaunchDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToast } = useToast();

    const [launch, setLaunch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const canEdit = user?.role === "CREATOR" || user?.role === "ADMIN";

    useEffect(() => {
        loadLaunch();
    }, [id]);

    async function loadLaunch() {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/launches/${id}`);
            setLaunch(response.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setError("Launch not found.");
            } else {
                setError("Failed to load launch details.");
            }
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <MainLayout title="Launch Detail">
                <div className="detail-loading">
                    <div className="detail-skeleton-card" />
                    <div className="detail-skeleton-card" />
                    <div className="detail-skeleton-card-lg" />
                </div>
            </MainLayout>
        );
    }

    if (error || !launch) {
        return (
            <MainLayout title="Launch Detail">
                <div className="detail-error">
                    <h2>Error</h2>
                    <p>{error || "Launch not found."}</p>
                    <button className="detail-error-btn" onClick={() => navigate("/launches")}>
                        <ArrowLeft size={16} />
                        Back to Launches
                    </button>
                </div>
            </MainLayout>
        );
    }

    const currentStatusIndex = STATUS_ORDER.indexOf(launch.status);

    return (
        <MainLayout title={launch.title}>
            <div className="detail-header">
                <div className="detail-breadcrumb">
                    <Link to="/launches">Launches</Link>
                    <span>/</span>
                    <span>{launch.title}</span>
                </div>

                <div className="detail-title-row">
                    <div>
                        <h1>{launch.title}</h1>
                        {launch.category && (
                            <CategoryBadge category={launch.category} />
                        )}
                    </div>
                    <div className="detail-actions">
                        {canEdit && (
                            <button
                                className="detail-edit-btn"
                                onClick={() => navigate(`/launches/edit/${launch._id}`)}
                            >
                                <Edit3 size={16} />
                                Edit Launch
                            </button>
                        )}
                        <div className="more-actions-wrapper">
                            <button
                                className="detail-more-btn"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <MoreVertical size={16} />
                                More Actions
                            </button>
                            {menuOpen && (
                                <>
                                    <div
                                        style={{
                                            position: "fixed",
                                            inset: 0,
                                            zIndex: 99,
                                        }}
                                        onClick={() => setMenuOpen(false)}
                                    />
                                    <div className="more-actions-menu">
                                        <button
                                            className="more-actions-item"
                                            onClick={() => {
                                                setMenuOpen(false);
                                                navigate(`/launches/edit/${launch._id}`);
                                            }}
                                        >
                                            <Edit3 size={16} />
                                            Edit Launch
                                        </button>
                                        <button
                                            className="more-actions-item danger"
                                            onClick={async () => {
                                                setMenuOpen(false);
                                                try {
                                                    await api.delete(`/launches/${launch._id}`);
                                                    addToast("Launch deleted.", "success");
                                                    navigate("/launches");
                                                } catch {
                                                    addToast("Failed to delete launch.", "error");
                                                }
                                            }}
                                        >
                                            <Trash2 size={16} />
                                            Delete Launch
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {launch.description && (
                    <p className="detail-desc">{launch.description}</p>
                )}
            </div>

            <div className="detail-section">
                <div className="detail-info-grid">
                    <div className="detail-card">
                        <div className="detail-card-label">Status</div>
                        <div className="detail-card-value">
                            <StatusBadge status={launch.status} />
                        </div>
                    </div>
                    <div className="detail-card">
                        <div className="detail-card-label">Market</div>
                        <div className="detail-card-value">{launch.market}</div>
                    </div>
                    <div className="detail-card">
                        <div className="detail-card-label">Launch Date</div>
                        <div className="detail-card-value">{launch.launchDate}</div>
                    </div>
                    <div className="detail-card">
                        <div className="detail-card-label">Owner</div>
                        <div className="detail-card-value">{launch.owner || "Marketing Team"}</div>
                    </div>
                    <div className="detail-card">
                        <div className="detail-card-label">Last Updated</div>
                        <div className="detail-card-value">{formatDateTime(launch.updatedAt)}</div>
                    </div>
                    <div className="detail-card">
                        <div className="detail-card-label">Current Step</div>
                        <div className="detail-card-value">{launch.currentStep || "\u2014"}</div>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h2>Description</h2>
                <div className="detail-desc-card">
                    <p>{launch.description || "No description provided."}</p>
                </div>
            </div>

            <div className="detail-section">
                <h2>Status Timeline</h2>
                <div className="detail-timeline">
                    <div className="timeline-steps">
                        {STATUS_ORDER.map((status, index) => {
                            const isCompleted = index < currentStatusIndex;
                            const isActive = index === currentStatusIndex;
                            return (
                                <div key={status} className="timeline-step">
                                    <div
                                        className={`timeline-dot${isActive ? " active" : ""}${isCompleted ? " completed" : ""}`}
                                    />
                                    <span
                                        className={`timeline-label${isActive ? " active" : ""}${isCompleted ? " completed" : ""}`}
                                    >
                                        {status}
                                    </span>
                                    {index < STATUS_ORDER.length - 1 && (
                                        <div
                                            className={`timeline-connector${isCompleted ? " completed" : ""}`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h2>Key Information</h2>
                <div className="detail-key-info">
                    <div className="key-info-grid">
                        <div className="key-info-item">
                            <span className="key-info-label">Product Category</span>
                            <span className={`key-info-value${!launch.productCategory ? " empty" : ""}`}>
                                {launch.productCategory || "\u2014"}
                            </span>
                        </div>
                        <div className="key-info-item">
                            <span className="key-info-label">Subcategory</span>
                            <span className={`key-info-value${!launch.subcategory ? " empty" : ""}`}>
                                {launch.subcategory || "\u2014"}
                            </span>
                        </div>
                        <div className="key-info-item">
                            <span className="key-info-label">Season</span>
                            <span className={`key-info-value${!launch.season ? " empty" : ""}`}>
                                {launch.season || "\u2014"}
                            </span>
                        </div>
                        <div className="key-info-item">
                            <span className="key-info-label">Region</span>
                            <span className={`key-info-value${!launch.region ? " empty" : ""}`}>
                                {launch.region || "\u2014"}
                            </span>
                        </div>
                        <div className="key-info-item">
                            <span className="key-info-label">Target Audience</span>
                            <span className={`key-info-value${!launch.targetAudience ? " empty" : ""}`}>
                                {launch.targetAudience || "\u2014"}
                            </span>
                        </div>
                        <div className="key-info-item">
                            <span className="key-info-label">Price Point</span>
                            <span className={`key-info-value${!launch.pricePoint ? " empty" : ""}`}>
                                {launch.pricePoint || "\u2014"}
                            </span>
                        </div>
                        <div className="key-info-item">
                            <span className="key-info-label">Distribution Channels</span>
                            <span className={`key-info-value${!launch.distributionChannels ? " empty" : ""}`}>
                                {launch.distributionChannels || "\u2014"}
                            </span>
                        </div>
                        <div className="key-info-item">
                            <span className="key-info-label">Tagline</span>
                            <span className={`key-info-value${!launch.tagline ? " empty" : ""}`}>
                                {launch.tagline || "\u2014"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h2>Assets</h2>
                <div className="detail-assets">
                    {launch.assets && launch.assets.length > 0 ? (
                        <div className="assets-list">
                            {launch.assets.map((asset, index) => (
                                <div key={index} className="asset-item">
                                    <FileText size={18} className="asset-icon" />
                                    <span className="asset-name">{asset}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="assets-empty">
                            <FileText size={32} />
                            <span>No assets available</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="detail-section">
                <h2>Comments</h2>
                <div className="detail-comments">
                    {launch.comments && launch.comments.length > 0 ? (
                        launch.comments.map((comment, index) => (
                            <div key={index}>
                                <strong>{comment.author}</strong>
                                <p>{comment.text}</p>
                                <small>{formatDateTime(comment.createdAt)}</small>
                            </div>
                        ))
                    ) : (
                        <div className="comments-empty">
                            <MessageCircle size={32} />
                            <span>No comments yet</span>
                        </div>
                    )}
                    <div className="comment-input-area">
                        <textarea
                            placeholder="Write a comment..."
                            disabled
                        />
                        <button className="comment-post-btn" disabled>
                            Post Comment
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default LaunchDetail;
