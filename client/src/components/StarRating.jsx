import { useState } from "react";
import styles from "./StarRating.module.css";

const sizeClasses = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
};

function StarRating({ rating = 0, onRate, size = "medium" }) {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClass = sizeClasses[size] || styles.medium;
  const interactive = typeof onRate === "function";

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  const renderStar = (index) => {
    const starNumber = index + 1;
    const fill = Math.max(0, Math.min(1, displayRating - index));

    if (interactive) {
      return (
        <button
          key={index}
          type="button"
          className={`${styles.starBtn} ${sizeClass}`}
          onClick={() => onRate(starNumber)}
          onMouseEnter={() => setHoverRating(starNumber)}
          onMouseLeave={() => setHoverRating(0)}
          aria-label={`Rate ${starNumber} star${starNumber > 1 ? "s" : ""}`}
        >
          <span className={styles.starIcon} aria-hidden="true">
            ★
          </span>
          {fill > 0 && fill < 1 && (
            <span
              className={styles.halfOverlay}
              style={{ width: `${fill * 100}%` }}
            >
              <span className={styles.starIcon}>★</span>
            </span>
          )}
        </button>
      );
    }

    return (
      <span
        key={index}
        className={`${styles.star} ${sizeClass}`}
        aria-hidden="true"
      >
        <span className={styles.starIcon}>★</span>
        {fill > 0 && fill < 1 && (
          <span
            className={styles.halfOverlay}
            style={{ width: `${fill * 100}%` }}
          >
            <span className={styles.starIcon}>★</span>
          </span>
        )}
      </span>
    );
  };

  return (
    <div
      className={styles.container}
      role={interactive ? undefined : "img"}
      aria-label={interactive ? undefined : `Rated ${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => renderStar(i))}
    </div>
  );
}

export default StarRating;
