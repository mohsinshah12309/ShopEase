import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import styles from "./AdminUsers.module.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // NOTE: baseURL already includes "/api" — never prefix calls here with "/api/"

  // Refresh the list in place (used after create/role/delete actions)
  const refreshUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.users || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const { data } = await api.get("/admin/users");
        if (mounted) {
          setUsers(data.users || []);
          setError("");
        }
      } catch (err) {
        if (mounted)
          setError(err.response?.data?.message || "Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleRoleToggle = async (user) => {
    const newRole = user.role === "admin" ? "customer" : "admin";

    try {
      await api.put(`/admin/users/${user._id}/role`, { role: newRole });
      refreshUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user role");
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Delete "${user.name}" (${user.email})? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      await api.delete(`/admin/users/${user._id}`);
      refreshUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await api.post("/admin/users", formData);
      setShowForm(false);
      setFormData({ name: "", email: "", password: "" });
      refreshUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create admin account");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Users</h1>
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => setShowForm((open) => !open)}
        >
          + Add Admin
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateAdmin}
          className={`glass-panel ${styles.addForm}`}
        >
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Full name"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="admin@example.com"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="Min. 6 characters"
                minLength={6}
                className={styles.input}
                required
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Admin"}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className={styles.loaderWrap}>
          <Loader size="large" />
        </div>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : users.length === 0 ? (
        <div className={`glass-panel ${styles.empty}`}>
          <p>No users found.</p>
        </div>
      ) : (
        <div className={`glass-panel ${styles.tableWrap}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className={styles.nameCell}>{user.name}</td>
                  <td className={styles.emailCell}>{user.email}</td>
                  <td>
                    <span
                      className={
                        user.role === "admin"
                          ? styles.badgeAdmin
                          : styles.badgeCustomer
                      }
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className={styles.joinedCell}>
                    {formatDate(user.createdAt)}
                  </td>
                  <td className={styles.actionsCell}>
                    <button
                      type="button"
                      className={styles.roleBtn}
                      onClick={() => handleRoleToggle(user)}
                    >
                      {user.role === "admin" ? "Make Customer" : "Make Admin"}
                    </button>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
