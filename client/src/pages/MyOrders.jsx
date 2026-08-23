import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import OrderStatusBadge from "../components/OrderStatusBadge";
import styles from "./MyOrders.module.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(data.orders);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={`glass-panel ${styles.errorState}`}>
          <span className={styles.errorIcon} aria-hidden="true">
            ⚠️
          </span>
          <h1 className={styles.errorTitle}>Something went wrong</h1>
          <p className={styles.errorText}>{error}</p>
          <Link to="/products" className={styles.primaryBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.page}>
        <div className={`glass-panel ${styles.emptyState}`}>
          <span className={styles.emptyIcon} aria-hidden="true">
            📦
          </span>
          <h1 className={styles.emptyTitle}>No orders yet</h1>
          <p className={styles.emptyText}>
            When you place an order, it will show up here.
          </p>
          <Link to="/products" className={styles.primaryBtn}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Orders</h1>

      <div className={styles.list}>
        {orders.map((order) => {
          const itemCount = order.orderItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          const date = new Date(order.createdAt).toLocaleDateString();

          return (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className={`glass-panel ${styles.row}`}
            >
              <div className={styles.rowInfo}>
                <span className={styles.rowLabel}>Order</span>
                <span className={styles.orderId}>{order._id}</span>
                <span className={styles.date}>{date}</span>
              </div>

              <div className={styles.rowMeta}>
                <span className={styles.itemCount}>
                  {itemCount} item{itemCount === 1 ? "" : "s"}
                </span>
                <span className={styles.total}>
                  ${order.totalPrice.toFixed(2)}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default MyOrders;
