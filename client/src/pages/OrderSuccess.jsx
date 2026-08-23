import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import styles from "./OrderSuccess.module.css";

function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load your order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <Loader size="large" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.page}>
        <div className={`glass-panel ${styles.errorState}`}>
          <span className={styles.errorIcon} aria-hidden="true">
            ⚠️
          </span>
          <h1 className={styles.errorTitle}>Order Not Found</h1>
          <p className={styles.errorText}>
            {error || "We couldn't find the order you're looking for."}
          </p>
          <Link to="/products" className={styles.primaryBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const { orderItems, shippingAddress, totalPrice, isPaid, paymentMethod } =
    order;

  return (
    <div className={styles.page}>
      {/* Success badge */}
      <div className={styles.badge} aria-hidden="true">
        <svg viewBox="0 0 64 64" className={styles.checkSvg}>
          <path
            className={styles.checkPath}
            d="M 18 33 L 28 43 L 46 23"
            fill="none"
            stroke="var(--success)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className={styles.title}>Order Confirmed</h1>
      <p className={styles.subtitle}>A confirmation email is on its way</p>

      {/* Order summary */}
      <div className={`glass-panel ${styles.summary}`}>
        <div className={styles.summaryHeader}>
          <span className={styles.summaryHeaderLabel}>Order ID</span>
          <span className={styles.orderId}>{id}</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.itemsList}>
          {orderItems.map((item) => (
            <div key={item._id} className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemQty}>
                  Qty: {item.quantity}
                  {item.unit ? ` · ${item.unit}` : ""}
                </span>
              </div>
              <span className={styles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.divider} />

        <div className={styles.addressBlock}>
          <span className={styles.addressLabel}>Shipping Address</span>
          <span className={styles.addressText}>
            {shippingAddress.street}, {shippingAddress.city},{" "}
            {shippingAddress.province} {shippingAddress.postalCode},{" "}
            {shippingAddress.country}
          </span>
        </div>

        <div className={styles.divider} />

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>
            {isPaid
              ? "Total Paid"
              : paymentMethod === "COD"
                ? "Total (Pay on Delivery)"
                : "Total"}
          </span>
          <span className={styles.totalValue}>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Link to={`/orders/${id}`} className={styles.primaryBtn}>
          View Order
        </Link>
        <Link to="/products" className={styles.secondaryBtn}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
