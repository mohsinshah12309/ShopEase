import StarRating from "./StarRating";
import styles from "./ReviewCard.module.css";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ReviewCard({ review, isOwn = false, onDelete }) {
  const { user, rating, comment, createdAt } = review;
  const reviewerName = user?.name || "Anonymous";

  return (
    <div className={`glass-panel ${styles.card}`}>
      <div className={styles.header}>
        <h4 className={styles.name}>{reviewerName}</h4>
        <StarRating rating={rating || 0} size="small" />
      </div>

      <p className={styles.comment}>{comment}</p>

      <div className={styles.footer}>
        <span className={styles.date}>{formatDate(createdAt)}</span>
        {isOwn && (
          <button type="button" className={styles.deleteBtn} onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default ReviewCard;
