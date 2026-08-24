import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import CheckoutForm from "../components/CheckoutForm";
import styles from "./Checkout.module.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 10;

const initialShippingAddress = {
  street: "",
  city: "",
  province: "",
  postalCode: "",
  country: "",
};

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(
    initialShippingAddress,
  );
  // "card" pays online via Stripe; "cod" = Cash on Delivery
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [step, setStep] = useState("shipping");
  const [clientSecret, setClientSecret] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [error, setError] = useState("");

  const shipping = cartTotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = cartTotal + shipping;

  const isAddressComplete = Object.values(shippingAddress).every(
    (value) => value.trim() !== "",
  );

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsCreatingOrder(true);

    try {
      const orderItems = cartItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        unit: item.unit || undefined,
      }));

      const { data } = await api.post("/orders", {
        orderItems,
        shippingAddress,
        paymentMethod,
      });

      setOrderId(data.order._id);

      if (data.clientSecret) {
        // Card flow — continue to Stripe payment step
        setClientSecret(data.clientSecret);
        setStep("payment");
      } else {
        // Cash on Delivery — order is placed, nothing left to pay online
        clearCart();
        navigate(`/order-success/${data.order._id}`);
      }
    } catch (err) {
      const isTimeout = err.code === "ECONNABORTED" || err.message?.includes("timeout");
      setError(
        isTimeout
          ? "The request timed out. Your order may still have been placed — check My Orders before retrying."
          : err.response?.data?.message ||
            "Failed to create your order. Please try again.",
      );
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    navigate(`/order-success/${orderId}`);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Checkout</h1>

      {/* Step progress indicator */}
      <div className={styles.progress}>
        <div
          className={`${styles.step} ${
            step === "shipping" ? styles.active : styles.completed
          }`}
        >
          <span className={styles.stepNumber}>1</span>
          <span className={styles.stepLabel}>Shipping</span>
        </div>
        <div className={styles.progressLine} />
        <div
          className={`${styles.step} ${
            step === "payment" ? styles.active : ""
          }`}
        >
          <span className={styles.stepNumber}>2</span>
          <span className={styles.stepLabel}>Payment</span>
        </div>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {step === "shipping" ? (
        <form
          className={`glass-panel ${styles.shippingForm}`}
          onSubmit={handleShippingSubmit}
        >
          <h2 className={styles.sectionTitle}>Shipping Address</h2>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="street">
              Street Address
            </label>
            <input
              id="street"
              name="street"
              type="text"
              className={styles.input}
              value={shippingAddress.street}
              onChange={handleAddressChange}
              required
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="city">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                className={styles.input}
                value={shippingAddress.city}
                onChange={handleAddressChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="province">
                Province / State
              </label>
              <input
                id="province"
                name="province"
                type="text"
                className={styles.input}
                value={shippingAddress.province}
                onChange={handleAddressChange}
                required
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="postalCode">
                Postal Code
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                className={styles.input}
                value={shippingAddress.postalCode}
                onChange={handleAddressChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="country">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                className={styles.input}
                value={shippingAddress.country}
                onChange={handleAddressChange}
                required
              />
            </div>
          </div>

          {/* Payment method selection */}
          <div className={styles.paymentMethods}>
            <h2 className={styles.sectionTitle}>Payment Method</h2>

            <label
              className={`${styles.methodOption} ${
                paymentMethod === "card" ? styles.methodActive : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <span className={styles.methodText}>
                <strong>Card</strong>
                <small>Pay securely online with Stripe</small>
              </span>
            </label>

            <label
              className={`${styles.methodOption} ${
                paymentMethod === "cod" ? styles.methodActive : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span className={styles.methodText}>
                <strong>Cash on Delivery</strong>
                <small>Pay with cash when your order arrives</small>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className={styles.continueBtn}
            disabled={!isAddressComplete || isCreatingOrder}
          >
            {isCreatingOrder
              ? "Placing Order..."
              : paymentMethod === "cod"
                ? "Place Order"
                : "Continue to Payment"}
          </button>
        </form>
      ) : (
        <div className={styles.paymentLayout}>
          {/* Order summary */}
          <aside className={`glass-panel ${styles.summary}`}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>

            <div className={styles.itemsList}>
              {cartItems.map((item) => (
                <div key={item.productId} className={styles.summaryItem}>
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

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Subtotal</span>
              <span className={styles.summaryValue}>
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Shipping</span>
              {shipping === 0 ? (
                <span className={styles.freeShipping}>Free</span>
              ) : (
                <span className={styles.summaryValue}>
                  ${shipping.toFixed(2)}
                </span>
              )}
            </div>

            <div className={styles.divider} />

            <div className={styles.summaryRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>${total.toFixed(2)}</span>
            </div>
          </aside>

          {/* Payment */}
          <div className={`glass-panel ${styles.paymentPanel}`}>
            <h2 className={styles.sectionTitle}>Payment</h2>
            <p className={styles.paymentText}>
              Paying as {user?.name || user?.email} · Card (Stripe)
            </p>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                clientSecret={clientSecret}
                orderId={orderId}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
