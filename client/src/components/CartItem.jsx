import { useCart } from "../context/CartContext";
import styles from "./CartItem.module.css";

function CartItem({ cartItem }) {
  const { key, unit, name, image, price, quantity, stock } = cartItem;
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecrement = () => {
    updateQuantity(key, quantity - 1);
  };

  const handleIncrement = () => {
    updateQuantity(key, quantity + 1);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!Number.isNaN(value)) {
      updateQuantity(key, value);
    }
  };

  const lineTotal = price * quantity;

  return (
    <div className={`glass-panel ${styles.item}`}>
      <img src={image} alt={name} className={styles.thumbnail} />

      <div className={styles.info}>
        <h3 className={styles.name}>
          {name}
          {unit && <span className={styles.unitBadge}>{unit}</span>}
        </h3>
        <span className={styles.unitPrice}>${price.toFixed(2)}</span>
      </div>

      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.stepBtn}
          onClick={handleDecrement}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          type="number"
          className={styles.quantityInput}
          value={quantity}
          min="1"
          max={stock}
          onChange={handleInputChange}
          aria-label="Quantity"
        />
        <button
          type="button"
          className={styles.stepBtn}
          onClick={handleIncrement}
          disabled={quantity >= stock}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <span className={styles.lineTotal}>${lineTotal.toFixed(2)}</span>

      <button
        type="button"
        className={styles.removeBtn}
        onClick={() => removeFromCart(key)}
        aria-label={`Remove ${name}${unit ? ` (${unit})` : ""} from cart`}
      >
        ×
      </button>
    </div>
  );
}

export default CartItem;
