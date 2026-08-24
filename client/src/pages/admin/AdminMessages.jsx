import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import styles from "./AdminMessages.module.css";

const STATUS_FILTERS = ["All", "Unread", "Read"];

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [actionId, setActionId] = useState(null);

  const fetchMessages = async () => {
    try {
      const params = {};
      if (statusFilter !== "All") {
        params.status = statusFilter.toLowerCase();
      }
      const { data } = await api.get("/admin/messages", { params });
      setMessages(data.messages || []);
      setUnreadCount(data.unreadCount || 0);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const handleToggleStatus = async (id, currentStatus) => {
    setActionId(id);
    try {
      const newStatus = currentStatus === "unread" ? "read" : "unread";
      await api.patch(`/admin/messages/${id}`, { status: newStatus });
      await fetchMessages();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    setActionId(id);
    try {
      await api.delete(`/admin/messages/${id}`);
      await fetchMessages();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete message");
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Customer Messages</h1>
          <p className={styles.subtitle}>
            Manage messages submitted by visitors through the Contact form.
          </p>
        </div>
        {unreadCount > 0 && (
          <div className={styles.unreadBadge}>
            ⚡ {unreadCount} Unread Message{unreadCount > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Status filter bar */}
      <div className={styles.filterRow}>
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            className={`${styles.filterBtn} ${
              statusFilter === status ? styles.filterBtnActive : ""
            }`}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      {messages.length === 0 ? (
        <div className={`glass-panel ${styles.emptyPanel}`}>
          <p>No messages found in this category.</p>
        </div>
      ) : (
        <div className={styles.messageList}>
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`glass-panel ${styles.card} ${
                msg.status === "unread" ? styles.cardUnread : ""
              }`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.senderInfo}>
                  <span className={styles.senderAvatar}>
                    {msg.name?.[0]?.toUpperCase() || "M"}
                  </span>
                  <div>
                    <h3 className={styles.senderName}>{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className={styles.senderEmail}>
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div className={styles.metaBox}>
                  <span className={msg.status === "unread" ? styles.badgeUnread : styles.badgeRead}>
                    {msg.status.toUpperCase()}
                  </span>
                  <span className={styles.dateText}>
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className={styles.messageBody}>
                <p className={styles.messageContent}>{msg.message}</p>
              </div>

              <div className={styles.cardActions}>
                <button
                  type="button"
                  disabled={actionId === msg._id}
                  onClick={() => handleToggleStatus(msg._id, msg.status)}
                  className={styles.statusToggleBtn}
                >
                  {msg.status === "unread" ? "Mark as Read" : "Mark as Unread"}
                </button>
                <a
                  href={`mailto:${msg.email}?subject=RE: Your contact message on ShopEase`}
                  className={styles.replyBtn}
                >
                  Reply Email
                </a>
                <button
                  type="button"
                  disabled={actionId === msg._id}
                  onClick={() => handleDelete(msg._id)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminMessages;
