import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import TiltCard3D from "./3d/TiltCard3D";
import styles from "./ProductCard.module.css";

function ProductCard({ product }) {
  const outOfStock = product.stock === 0;
  const hasDiscount = product.discountPrice != null;

  return (
    <TiltCard3D className={`${styles.card} squircle`} intensity={12}>
      <Link to={`/products/${product._id}`} className={styles.cardLink}>
        <div className={styles.imageWrap}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
          <div className={styles.imageOverlay} />
          {outOfStock && (
            <div className={styles.outOfStockOverlay}>
              <span>Out of Stock</span>
            </div>
          )}
          {hasDiscount && !outOfStock && (
            <span className={styles.saleBadge}>
              ⚡ SALE
            </span>
          )}
          <span className={styles.view3dBadge}>
            🌐 3D View
          </span>
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
            <button type="button" className={styles.quickViewBtn}>
              Inspect
            </button>
          </div>
        </div>
      </Link>
    </TiltCard3D>
  );
}

export default ProductCard;
