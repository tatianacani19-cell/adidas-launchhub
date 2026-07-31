import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft, MoreVertical, Edit3, Trash2,
    FileText, FileImage, FileSpreadsheet, FileArchive,
    Video, File as FileIcon, Download, Upload,
    MessageCircle, Loader2, Image as ImageIcon,
    X as XIcon, FilePlus, ArrowRightLeft, CheckCircle, Globe, Archive,
    Clock, User,
} from "lucide-react";

import MainLayout from "../components/layout/MainLayout";
import StatusBadge from "../components/launches/StatusBadge";
import CategoryBadge from "../components/launches/CategoryBadge";
import { formatDateTime, formatDate, formatTime, getActivityIcon } from "../utils/formatDateTime";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

import "../styles/launchDetail.css";

const STATUS_ORDER = ["Draft", "In Review", "Approved", "Published"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const KEY_INFO_FIELDS = [
    { key: "tagline", label: "Tagline" },
    { key: "season", label: "Season" },
    { key: "productCategory", label: "Product Category" },
    { key: "subcategory", label: "Subcategory" },
    { key: "distributionChannels", label: "Distribution Channels" },
    { key: "pricePoint", label: "Price Point" },
    { key: "targetAudience", label: "Target Audience" },
    { key: "region", label: "Regions" },
];

const ICON_COMPONENTS = {
    FilePlus,
    Edit3,
    ArrowRightLeft,
    Upload,
    Trash2,
    Image: ImageIcon,
    CheckCircle,
    Globe,
    Archive,
    Activity: FileText,
};

function LaunchDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToast } = useToast();

    const [launch, setLaunch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [productImageUploading, setProductImageUploading] = useState(false);
    const [productImageProgress, setProductImageProgress] = useState(0);
    const [keyInfoEdit, setKeyInfoEdit] = useState(false);
    const [keyInfoForm, setKeyInfoForm] = useState({
        tagline: "", season: "", productCategory: "", subcategory: "",
        distributionChannels: "", pricePoint: "", targetAudience: "", region: "",
    });
    const [keyInfoSaving, setKeyInfoSaving] = useState(false);
    const fileInputRef = useRef(null);
    const productImageInputRef = useRef(null);

    const canEdit = user?.role === "CREATOR" || user?.role === "ADMIN";
    const canDelete = canEdit;

    const API_BASE = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL
        : "http://localhost:3000";

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

    async function handleUpload(file) {
        if (!file || uploading) return;
        try {
            setUploading(true);
            setUploadProgress(0);
            const formData = new FormData();
            formData.append("file", file);
            await api.post(`/launches/${id}/assets`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (e) => {
                    if (e.total) setUploadProgress(Math.round((e.loaded * 100) / e.total));
                },
            });
            addToast("File uploaded.", "success");
            loadLaunch();
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to upload file.";
            addToast(msg, "error");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    }

    async function handleProductImageUpload(file) {
        if (!file || productImageUploading) return;

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            addToast("Only JPG, JPEG and PNG images are allowed.", "error");
            return;
        }

        try {
            setProductImageUploading(true);
            setProductImageProgress(0);
            const formData = new FormData();
            formData.append("file", file);
            await api.post(`/launches/${id}/assets/product-image`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (e) => {
                    if (e.total) setProductImageProgress(Math.round((e.loaded * 100) / e.total));
                },
            });
            addToast("Product image uploaded.", "success");
            loadLaunch();
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to upload product image.";
            addToast(msg, "error");
        } finally {
            setProductImageUploading(false);
            setProductImageProgress(0);
        }
    }

    async function handleDeleteAsset(assetId) {
        try {
            await api.delete(`/launches/${id}/assets/${assetId}`);
            addToast("Asset deleted.", "success");
            loadLaunch();
        } catch {
            addToast("Failed to delete asset.", "error");
        }
    }

    async function handleDeleteProductImage() {
        try {
            await api.delete(`/launches/${id}/assets/product-image`);
            addToast("Product image deleted.", "success");
            loadLaunch();
        } catch {
            addToast("Failed to delete product image.", "error");
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) handleUpload(files[0]);
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) handleUpload(files[0]);
        e.target.value = "";
    }

    function handleProductImageSelect(e) {
        const files = e.target.files;
        if (files.length > 0) handleProductImageUpload(files[0]);
        e.target.value = "";
    }

    function startKeyInfoEdit() {
        setKeyInfoForm({
            tagline: launch.tagline || "",
            season: launch.season || "",
            productCategory: launch.productCategory || "",
            subcategory: launch.subcategory || "",
            distributionChannels: launch.distributionChannels || "",
            pricePoint: launch.pricePoint || "",
            targetAudience: launch.targetAudience || "",
            region: launch.market || launch.region || "",
        });
        setKeyInfoEdit(true);
    }

    function cancelKeyInfoEdit() {
        setKeyInfoEdit(false);
    }

    function handleKeyInfoChange(field, value) {
        setKeyInfoForm(prev => ({ ...prev, [field]: value }));
    }

    async function saveKeyInfo() {
        try {
            setKeyInfoSaving(true);
            await api.put(`/launches/${id}`, keyInfoForm);
            addToast("Key information updated.", "success");
            setKeyInfoEdit(false);
            loadLaunch();
        } catch {
            addToast("Failed to save key information.", "error");
        } finally {
            setKeyInfoSaving(false);
        }
    }

    function formatSize(bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / 1048576).toFixed(1) + " MB";
    }

    function getAssetIcon(mimeType) {
        if (!mimeType) return FileIcon;
        if (mimeType.startsWith("image/")) return FileImage;
        if (mimeType.startsWith("video/")) return Video;
        if (mimeType.includes("spreadsheet") || mimeType.includes("excel") || mimeType.includes("csv")) return FileSpreadsheet;
        if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar") || mimeType.includes("7z")) return FileArchive;
        if (mimeType.includes("pdf") || mimeType.includes("word") || mimeType.includes("document")) return FileText;
        return FileIcon;
    }

    const currentStatusIndex = STATUS_ORDER.indexOf(launch?.status);

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

    const productImageUrl = launch.productImage?.url
        ? `${API_BASE}${launch.productImage.url}`
        : null;

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

            <div className="detail-info-row">
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

            <div className="detail-body">
                <div className="detail-row-main">
                    <div className="detail-left-col">
                        <div className="detail-section">
                            <h2>Description</h2>
                            <div className="detail-desc-card">
                                <p>{launch.description || "No description provided."}</p>
                            </div>
                        </div>

                        <div className="detail-section fill-grow">
                            <div className="detail-section-header">
                                <h2>Key Information</h2>
                                {canEdit && !keyInfoEdit && (
                                    <button className="key-info-edit-btn" onClick={startKeyInfoEdit}>
                                        <Edit3 size={14} />
                                        Edit
                                    </button>
                                )}
                            </div>
                            <div className="detail-key-info fill-child">
                                <div className="key-info-grid">
                                    {KEY_INFO_FIELDS.map(field => (
                                        <div key={field.key} className="key-info-item">
                                            <span className="key-info-label">{field.label}</span>
                                            {keyInfoEdit ? (
                                                <input
                                                    type="text"
                                                    className="key-info-input"
                                                    value={keyInfoForm[field.key]}
                                                    onChange={e => handleKeyInfoChange(field.key, e.target.value)}
                                                    disabled={field.key === "region"}
                                                    placeholder={field.key === "region" ? "Auto-filled from market" : `Enter ${field.label.toLowerCase()}`}
                                                />
                                            ) : (
                                                <span className={`key-info-value ${!launch[field.key] ? "empty" : ""}`}>
                                                    {launch[field.key] || "\u2014"}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {keyInfoEdit && (
                                    <div className="key-info-actions">
                                        <button className="key-info-save-btn" onClick={saveKeyInfo} disabled={keyInfoSaving}>
                                            {keyInfoSaving && <Loader2 size={14} className="spin" />}
                                            {keyInfoSaving ? "Saving..." : "Save"}
                                        </button>
                                        <button className="key-info-cancel-btn" onClick={cancelKeyInfoEdit} disabled={keyInfoSaving}>
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="detail-right-col">
                        <div className="detail-section fill-grow-2">
                            <h2>Activity Log</h2>
                            <div className="detail-timeline fill-child">
                                <div className="activity-timeline">
                                    {launch.activityLog && launch.activityLog.length > 0 ? (
                                        [...launch.activityLog].reverse().map((activity, index) => {
                                            const IconComponent = ICON_COMPONENTS[getActivityIcon(activity.action)] || ICON_COMPONENTS.Activity;
                                            return (
                                                <div key={activity._id || index} className="activity-item">
                                                    <div className="activity-marker">
                                                        <IconComponent size={16} className="activity-icon" />
                                                    </div>
                                                    <div className="activity-content">
                                                        <div className="activity-header">
                                                            <span className="activity-action">{activity.action}</span>
                                                            <span className="activity-description">{activity.description}</span>
                                                        </div>
                                                        <div className="activity-meta">
                                                            <span className="activity-user">
                                                                <User size={12} />
                                                                {activity.performedBy?.name || "Unknown User"}
                                                            </span>
                                                            <span className="activity-time">
                                                                <Clock size={12} />
                                                                {formatDate(activity.createdAt)} \u00B7 {formatTime(activity.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {index < (launch.activityLog?.length || 0) - 1 && (
                                                        <div className="activity-connector" />
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="activity-empty">
                                            <FileText size={32} />
                                            <span>No activity recorded yet</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="detail-section fill-grow-1">
                            <h2>Assets</h2>
                            <div className="detail-assets-wrapper fill-child">
                                <div className="detail-section-header">
                                    <h2>Product Image</h2>
                                    {canEdit && productImageUrl && (
                                        <div className="product-image-actions-header">
                                            <button
                                                className="asset-action-btn"
                                                onClick={() => productImageInputRef.current?.click()}
                                                title="Replace Product Image"
                                            >
                                                <Upload size={14} />
                                            </button>
                                            <button
                                                className="asset-action-btn danger"
                                                onClick={handleDeleteProductImage}
                                                title="Delete Product Image"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="detail-assets-inner">
                                    <input
                                        ref={productImageInputRef}
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png"
                                        style={{ display: "none" }}
                                        onChange={handleProductImageSelect}
                                    />

                                    {productImageUrl ? (
                                        <div className="product-image-preview">
                                            <img src={productImageUrl} alt={launch.title} className="product-image-thumb" />
                                            <div className="product-image-info">
                                                <span className="product-image-name">{launch.productImage?.originalName || "Product Image"}</span>
                                                <span className="product-image-meta">
                                                    {launch.productImage?.size ? formatSize(launch.productImage.size) : ""}
                                                    {launch.productImage?.size && launch.productImage?.uploadedAt ? " \u00B7 " : ""}
                                                    {launch.productImage?.uploadedAt ? formatDateTime(launch.productImage.uploadedAt) : ""}
                                                </span>
                                            </div>
                                        </div>
                                    ) : canEdit ? (
                                        <div
                                            className={`asset-dropzone ${dragOver ? "drag-over" : ""} ${productImageUploading ? "uploading" : ""}`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setDragOver(false);
                                                const files = e.dataTransfer.files;
                                                if (files.length > 0) handleProductImageUpload(files[0]);
                                            }}
                                            onClick={() => !productImageUploading && productImageInputRef.current?.click()}
                                        >
                                            {productImageUploading ? (
                                                <div className="asset-upload-progress">
                                                    <Loader2 size={24} className="spin" />
                                                    <span>Uploading... {productImageProgress}%</span>
                                                    <div className="progress-bar">
                                                        <div className="progress-fill" style={{ width: `${productImageProgress}%` }} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="asset-dropzone-text">
                                                    <ImageIcon size={24} />
                                                    <span>Upload Product Image (JPG, JPEG, PNG)</span>
                                                    <small>Click or drag & drop</small>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="assets-empty">
                                            <ImageIcon size={32} />
                                            <span>No product image</span>
                                        </div>
                                    )}
                                </div>

                                <div className="assets-divider" />

                                <div className="detail-section-header">
                                    <h2>Files</h2>
                                    {canEdit && (
                                        <button
                                            className="detail-upload-btn"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                        >
                                            <Upload size={16} />
                                            Upload Asset
                                        </button>
                                    )}
                                </div>
                                <div className="detail-assets-inner">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={handleFileSelect}
                                    />

                                    {canEdit && (
                                        <div
                                            className={`asset-dropzone ${dragOver ? "drag-over" : ""} ${uploading ? "uploading" : ""}`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            onClick={() => !uploading && fileInputRef.current?.click()}
                                        >
                                            {uploading ? (
                                                <div className="asset-upload-progress">
                                                    <Loader2 size={24} className="spin" />
                                                    <span>Uploading... {uploadProgress}%</span>
                                                    <div className="progress-bar">
                                                        <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="asset-dropzone-text">
                                                    <Upload size={24} />
                                                    <span>Drop files here or click to upload</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {launch.assets && launch.assets.length > 0 ? (
                                        <div className="assets-list">
                                            {launch.assets.map((asset) => {
                                                const AssetIcon = getAssetIcon(asset.mimeType);
                                                const isImage = asset.mimeType?.startsWith("image/");
                                                return (
                                                    <div key={asset._id} className="asset-item">
                                                        {isImage ? (
                                                            <img
                                                                src={`${API_BASE}${asset.url}`}
                                                                alt={asset.originalName}
                                                                className="asset-thumb"
                                                            />
                                                        ) : (
                                                            <AssetIcon size={20} className="asset-icon" />
                                                        )}
                                                        <div className="asset-info">
                                                            <span className="asset-name" title={asset.originalName}>
                                                                {asset.originalName}
                                                            </span>
                                                            <span className="asset-meta">
                                                                {formatSize(asset.size)}
                                                                {" \u00B7 "}
                                                                {formatDateTime(asset.uploadedAt)}
                                                            </span>
                                                        </div>
                                                        <div className="asset-actions">
                                                            <a
                                                                href={`${API_BASE}${asset.url}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="asset-action-btn"
                                                                title="Download"
                                                                download={asset.originalName}
                                                            >
                                                                <Download size={16} />
                                                            </a>
                                                            {canDelete && (
                                                                <button
                                                                    className="asset-action-btn danger"
                                                                    onClick={() => handleDeleteAsset(asset._id)}
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="assets-empty">
                                            <FileText size={32} />
                                            <span>No assets available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
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
            </div>
        </MainLayout>
    );
}

export default LaunchDetail;