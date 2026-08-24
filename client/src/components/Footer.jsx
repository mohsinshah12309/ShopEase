import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={`glass-panel ${styles.footer}`}>
      <div className={styles.container}>
        <span className={styles.siteName}>Nexura</span>
        <nav className={styles.links} aria-label="Footer navigation">
          <Link to="/about" className={styles.link}>
            About
          </Link>
          <Link to="/contact" className={styles.link}>
            Contact
          </Link>
          <Link to="/terms" className={styles.link}>
            Terms
          </Link>
        </nav>
      </div>
      <p className={styles.copyright}>
        &copy; {year} Nexura. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
