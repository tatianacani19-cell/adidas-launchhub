import { useState, useEffect } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";

const ROLES = ["ADMIN", "CREATOR", "APPROVER"];

function UserManagement() {

    const { addToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "CREATOR" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            setLoading(true);
            const response = await api.get("/users");
            setUsers(response.data);
        } catch (err) {
            addToast("Failed to load users.", "error");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (submitting) return;

        try {
            setSubmitting(true);
            await api.post("/users", form);
            addToast("User created successfully.", "success");
            setForm({ name: "", email: "", password: "", role: "CREATOR" });
            setShowForm(false);
            loadUsers();
        } catch (err) {
            const message = err.response?.data?.message || "Failed to create user.";
            addToast(message, "error");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleRoleChange(userId, newRole) {
        try {
            await api.put(`/users/${userId}`, { role: newRole });
            addToast("Role updated.", "success");
            loadUsers();
        } catch (err) {
            addToast("Failed to update role.", "error");
        }
    }

    async function handleStatusToggle(userId, currentStatus) {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        try {
            await api.put(`/users/${userId}`, { status: newStatus });
            addToast(`User ${newStatus === "active" ? "activated" : "deactivated"}.`, "success");
            loadUsers();
        } catch (err) {
            addToast("Failed to update status.", "error");
        }
    }

    async function handleDelete(userId) {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/users/${userId}`);
            addToast("User deleted.", "success");
            loadUsers();
        } catch (err) {
            addToast("Failed to delete user.", "error");
        }
    }

    const roleColors = {
        ADMIN: { bg: "#FEE2E2", color: "#991B1B" },
        CREATOR: { bg: "#DBEAFE", color: "#1E40AF" },
        APPROVER: { bg: "#FEF9C3", color: "#92400E" },
    };

    return (
        <div className="user-management">
            <div className="user-management-header">
                <span className="user-count">{users.length} users</span>
                <button className="settings-btn primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "Add User"}
                </button>
            </div>

            {showForm && (
                <form className="user-form" onSubmit={handleCreate}>
                    <div className="user-form-grid">
                        <input
                            type="text"
                            placeholder="Full name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            minLength={6}
                        />
                        <select
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                        >
                            {ROLES.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="settings-btn primary" disabled={submitting}>
                        {submitting ? "Creating..." : "Create User"}
                    </button>
                </form>
            )}

            {loading ? (
                <p className="user-loading">Loading users...</p>
            ) : (
                <div className="user-list">
                    {users.map((u) => {
                        const style = roleColors[u.role] || roleColors.CREATOR;
                        return (
                            <div key={u._id} className="user-row">
                                <div className="user-info">
                                    <div className="user-avatar">
                                        {u.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                                    </div>
                                    <div>
                                        <h4>{u.name}</h4>
                                        <span>{u.email}</span>
                                    </div>
                                </div>
                                <div className="user-actions">
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                        className="user-role-select"
                                    >
                                        {ROLES.map((r) => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                    <span
                                        className="settings-badge"
                                        style={{
                                            background: u.status === "active" ? "#DCFCE7" : "#FEE2E2",
                                            color: u.status === "active" ? "#166534" : "#991B1B",
                                        }}
                                    >
                                        {u.status}
                                    </span>
                                    <button
                                        className="settings-btn outline small"
                                        onClick={() => handleStatusToggle(u._id, u.status)}
                                    >
                                        {u.status === "active" ? "Deactivate" : "Activate"}
                                    </button>
                                    <button
                                        className="settings-btn outline small danger"
                                        onClick={() => handleDelete(u._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default UserManagement;
