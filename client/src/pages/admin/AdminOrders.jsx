import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import styles from "./AdminOrders.module.css";

const STATUS_FILTERS = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [busyOrderId, setBusyOrderId] = useState(null);

  // Refresh the list in place (used after complete/cancel actions)
  const refreshOrders = async () => {
    try {
      const { data } = await api.get("/orders", {
        params: { status: statusFilter === "All" ? undefined : statusFilter },
      });
      setOrders(data.orders || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const { data } = await api.get("/orders", {
          params: { status: statusFilter === "All" ? undefined : statusFilter },
        });
        if (mounted) {
          setOrders(data.orders || []);
          setError("");
        }
      } catch (err) {
        if (mounted)
          setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [statusFilter]);

  const handleComplete = async (order) => {
    const confirmed = window.confirm(
      `Mark order ${order._id.slice(-8)} as completed? This records it as a sale.`,
    );
    if (!confirmed) return;

    setBusyOrderId(order._id);
    try {
      await api.put(`/orders/${order._id}/complete`);
      await refreshOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete order");
    } finally {
      setBusyOrderId(null);
    }
  };

  const handleCancel = async (order) => {
    const confirmed = window.confirm(
      `Cancel order ${order._id.slice(-8)}? Stock will be returned to inventory.`,
    );
    if (!confirmed) return;

    setBusyOrderId(order._id);
    try {
      await api.delete(`/orders/${order._id}`);
      await refreshOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setBusyOrderId(null);
    }
  };

  const formatDate = (value) =>
    new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Orders</h1>

      {/* Status filter */}
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

      {loading ? (
        <div className={styles.loaderWrap}>
          <Loader size="large" />
        </div>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : orders.length === 0 ? (
        <div className={`glass-panel ${styles.empty}`}>
          <p>
            No {statusFilter !== "All" ? statusFilter.toLowerCase() : ""} orders
            yet.
          </p>
        </div>
      ) : (
        <div className={`glass-panel ${styles.tableWrap}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className={styles.orderIdCell} title={order._id}>
                    …{order._id.slice(-8)}
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td className={styles.customerCell}>
                    <span className={styles.customerName}>
                      {order.user?.name || "Unknown"}
                    </span>
                    <span className={styles.customerEmail}>
                      {order.user?.email || ""}
                    </span>
                  </td>
                  <td>{order.orderItems?.length ?? 0}</td>
                  <td className={styles.totalCell}>
                    ${(order.totalPrice ?? 0).toFixed(2)}
                  </td>
                  <td className={styles.paymentCell}>
                    <span>
                      {order.paymentMethod === "COD" ? "COD" : "Card"}
                    </span>
                    <span
                      className={
                        order.isPaid ? styles.paidTag : styles.unpaidTag
                      }
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className={styles.actionsCell}>
                    <Link
                      to={`/orders/${order._id}`}
                      className={styles.viewBtn}
                      title="View order details"
                    >
                      View
                    </Link>
                    {order.status !== "Delivered" &&
                      order.status !== "Cancelled" && (
                        <button
                          type="button"
                          className={styles.completeBtn}
                          disabled={busyOrderId === order._id}
                          onClick={() => handleComplete(order)}
                        >
                          Complete
                        </button>
                      )}
                    {order.status === "Pending" && (
                      <button
                        type="button"
                        className={styles.cancelBtn}
                        disabled={busyOrderId === order._id}
                        onClick={() => handleCancel(order)}
                      >
                        Cancel
                      </button>
                    )}
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

export default AdminOrders;
