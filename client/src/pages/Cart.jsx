import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartItem from "../components/CartItem";
import styles from "./Cart.module.css";

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 10;

function Cart() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className={styles.page}>
        <div className={`glass-panel ${styles.emptyState}`}>
          <span className={styles.emptyIcon} aria-hidden="true">
            🛒
          </span>
          <h1 className={styles.emptyTitle}>Your cart is empty</h1>
          <p className={styles.emptyText}>
            Looks like you haven't added anything yet. Browse our products and
            find something you'll love.
          </p>
          <Link to="/products" className={styles.browseBtn}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = cartTotal + shipping;

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shopping Cart</h1>
        <span className={styles.count}>
          {cartCount} item{cartCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className={styles.layout}>
        {/* Left column — cart items */}
        <div className={styles.itemsColumn}>
          <button
            type="button"
            className={styles.clearCartBtn}
            onClick={handleClearCart}
          >
            Clear Cart
          </button>

          <div className={styles.itemsList}>
            {cartItems.map((item) => (
              <CartItem key={item.productId} cartItem={item} />
            ))}
          </div>
        </div>

        {/* Right column — order summary */}
        <aside className={`glass-panel ${styles.summary}`}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>

          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Subtotal</span>
            <span className={styles.summaryValue}>${cartTotal.toFixed(2)}</span>
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

          <button
            type="button"
            className={styles.checkoutBtn}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
