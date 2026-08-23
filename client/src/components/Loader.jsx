import styles from "./Loader.module.css";

const sizeClasses = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
};

function Loader({ size = "medium" }) {
  const sizeClass = sizeClasses[size] || styles.medium;

  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={`${styles.spinner} ${sizeClass}`} />
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );
}

export default Loader;
