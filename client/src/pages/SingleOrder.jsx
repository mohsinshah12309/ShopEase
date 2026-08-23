import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { useAuth } from "../context/AuthContext";
import styles from "./SingleOrder.module.css";

function SingleOrder() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load this order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const refetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load this order.");
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );
    if (!confirmed) return;

    setCancelling(true);
    try {
      await api.delete(`/orders/${id}`);
      await refetchOrder();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel this order.");
    } finally {
      setCancelling(false);
    }
  };

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
          <Link to="/orders" className={styles.primaryBtn}>
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const {
    orderItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    totalPrice,
    status,
    isPaid,
    paymentMethod,
    createdAt,
  } = order;

  const date = new Date(createdAt).toLocaleDateString();
  const isOwner = user && order.user.toString() === user.id;
  const canCancel = status === "Pending" && isOwner;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Order Details</h1>

      {/* Order header */}
      <div className={`glass-panel ${styles.header}`}>
        <div className={styles.headerRow}>
          <span className={styles.headerLabel}>Order ID</span>
          <span className={styles.orderId}>{order._id}</span>
        </div>

        <div className={styles.headerRow}>
          <span className={styles.headerLabel}>Date</span>
          <span className={styles.date}>{date}</span>
        </div>

        <div className={styles.headerRow}>
          <span className={styles.headerLabel}>Status</span>
          <OrderStatusBadge status={status} />
        </div>

        <div className={styles.headerRow}>
          <span className={styles.headerLabel}>Payment</span>
          <span
            className={`${styles.paymentStatus} ${
              isPaid ? styles.paid : styles.unpaid
            }`}
          >
            {isPaid
              ? "Paid"
              : paymentMethod === "COD"
                ? "Pay on Delivery"
                : "Unpaid"}
          </span>
        </div>

        <div className={styles.headerRow}>
          <span className={styles.headerLabel}>Method</span>
          <span className={styles.date}>
            {paymentMethod === "COD" ? "Cash on Delivery" : "Card (Stripe)"}
          </span>
        </div>
      </div>

      {/* Ordered items */}
      <div className={`glass-panel ${styles.itemsPanel}`}>
        <h2 className={styles.sectionTitle}>Items</h2>
        <div className={styles.itemsList}>
          {orderItems.map((item) => (
            <div key={item._id} className={styles.item}>
              <img
                src={item.image}
                alt={item.name}
                className={styles.thumbnail}
              />
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
      </div>

      {/* Shipping address */}
      <div className={`glass-panel ${styles.addressPanel}`}>
        <h2 className={styles.sectionTitle}>Shipping Address</h2>
        <p className={styles.addressText}>
          {shippingAddress.street}, {shippingAddress.city},{" "}
          {shippingAddress.province} {shippingAddress.postalCode},{" "}
          {shippingAddress.country}
        </p>
      </div>

      {/* Price breakdown */}
      <div className={`glass-panel ${styles.pricingPanel}`}>
        <div className={styles.priceRow}>
          <span className={styles.priceLabel}>Items</span>
          <span className={styles.priceValue}>${itemsPrice.toFixed(2)}</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.priceLabel}>Shipping</span>
          <span className={styles.priceValue}>${shippingPrice.toFixed(2)}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.priceRow}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalValue}>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Cancel order */}
      {canCancel && (
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={handleCancel}
          disabled={cancelling}
        >
          {cancelling ? "Cancelling..." : "Cancel Order"}
        </button>
      )}
    </div>
  );
}

export default SingleOrder;
