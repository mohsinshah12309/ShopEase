import { useRef } from "react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import styles from "./ProductCard.module.css";

function ProductCard({ product }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = (y / rect.height - 0.5) * -6;
    const rotateY = (x / rect.width - 0.5) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  };

  const outOfStock = product.stock === 0;
  const hasDiscount = product.discountPrice != null;

  return (
    <Link
      to={`/products/${product._id}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${styles.card} squircle`}
    >
      <div className={styles.imageWrap}>
        <img
          src={product.images?.[0]}
          alt={product.name}
          className={styles.image}
        />
        {outOfStock && (
          <div className={styles.outOfStockOverlay}>
            <span>Out of Stock</span>
          </div>
        )}
        {hasDiscount && !outOfStock && (
          <span className={styles.saleBadge}>Sale</span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.ratingRow}>
          <StarRating rating={product.ratings || 0} size="small" />
          <span className={styles.reviewCount}>
            ({product.numReviews || 0})
          </span>
        </div>

        <div className={styles.priceRow}>
          {hasDiscount ? (
            <>
              <span className={styles.priceDiscount}>
                ${product.discountPrice}
              </span>
              <span className={styles.priceOriginal}>${product.price}</span>
            </>
          ) : (
            <span className={styles.price}>${product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
