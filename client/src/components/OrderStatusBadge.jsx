import styles from "./OrderStatusBadge.module.css";

const statusClasses = {
  Pending: styles.pending,
  Processing: styles.processing,
  Shipped: styles.shipped,
  Delivered: styles.delivered,
  Cancelled: styles.cancelled,
};

function OrderStatusBadge({ status }) {
  const statusClass = statusClasses[status] || styles.pending;

  return (
    <span className={`${styles.badge} ${statusClass}`}>
      <span className={styles.dot} aria-hidden="true" />
      {status}
    </span>
  );
}

export default OrderStatusBadge;
