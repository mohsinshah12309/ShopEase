import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import styles from "./Navbar.module.css";

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, cartPulse } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`glass-panel ${styles.header}`}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          ShopEase
        </Link>

        <button
          type="button"
          className={styles.hamburger}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
        </button>

        <div className={`${styles.links} ${menuOpen ? styles.linksOpen : ""}`}>
          <Link to="/products" className={styles.link} onClick={closeMenu}>
            Products
          </Link>

          <Link to="/cart" className={styles.link} onClick={closeMenu}>
            <span className={styles.cartIcon}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span
                  key={cartPulse}
                  className={`${styles.badge} ${
                    cartPulse > 0 ? styles.badgePulse : ""
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </span>
            <span className={styles.cartLabel}>Cart</span>
          </Link>

          {!user ? (
            <div className={styles.auth}>
              <Link to="/register" className={styles.link} onClick={closeMenu}>
                Register
              </Link>
              <Link to="/login" className={styles.loginBtn} onClick={closeMenu}>
                Login
              </Link>
            </div>
          ) : (
            <div className={styles.auth}>
              <span
                id="navbar-avatar"
                className={styles.avatar}
                title={user.name}
              >
                {user.name?.trim()?.[0]?.toUpperCase() || "?"}
              </span>
              {user.name && (
                <span className={styles.userName}>{user.name}</span>
              )}
              <Link to="/orders" className={styles.link} onClick={closeMenu}>
                My Orders
              </Link>
              <Link to="/profile" className={styles.link} onClick={closeMenu}>
                Profile
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className={styles.link} onClick={closeMenu}>
                  Admin
                </Link>
              )}
              <button
                type="button"
                className={styles.logoutBtn}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
