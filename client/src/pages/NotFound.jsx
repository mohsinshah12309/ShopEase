import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>This page drifted out of orbit</p>
      <Link to="/" className={styles.button}>
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
