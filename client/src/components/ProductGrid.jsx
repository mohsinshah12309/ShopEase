import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";

function SkeletonCard() {
  return (
    <div className={`glass-panel ${styles.skeletonCard}`}>
      <div className={`${styles.skeleton} ${styles.skeletonImage}`} />
      <div className={styles.skeletonBody}>
        <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
        <div className={`${styles.skeleton} ${styles.skeletonLineShort}`} />
        <div className={`${styles.skeleton} ${styles.skeletonLineShort}`} />
      </div>
    </div>
  );
}

function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div
        className={styles.grid}
        aria-busy="true"
        aria-label="Loading products"
      >
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <p className={styles.empty}>No products found</p>;
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
