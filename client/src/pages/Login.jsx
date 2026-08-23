import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Auth.module.css";

const ARROW_SIZE = 40;
const TRAVEL_MS = 700;
const TOTAL_MS = 900;

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [arrow, setArrow] = useState(null);
  const [arrowMoved, setArrowMoved] = useState(false);
  const [arrowFading, setArrowFading] = useState(false);

  // Trigger the transition to the target position after the arrow mounts
  useEffect(() => {
    if (!arrow) return;
    const raf = requestAnimationFrame(() => setArrowMoved(true));
    return () => cancelAnimationFrame(raf);
  }, [arrow]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setSubmitting(true);
    try {
      await login(email, password);

      const avatar = document.getElementById("navbar-avatar");
      if (!avatar || !buttonRef.current) {
        navigate("/");
        return;
      }

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const avatarRect = avatar.getBoundingClientRect();

      const startX = buttonRect.left + buttonRect.width / 2;
      const startY = buttonRect.top + buttonRect.height / 2;
      const endX = avatarRect.left + avatarRect.width / 2;
      const endY = avatarRect.top + avatarRect.height / 2;

      setArrow({ startX, startY, endX, endY });

      // After travel completes, fade the arrow and pulse the avatar
      setTimeout(() => {
        setArrowFading(true);
        avatar.classList.add(styles.avatarPulse);
        setTimeout(() => avatar.classList.remove(styles.avatarPulse), 500);
      }, TRAVEL_MS);

      // Navigate after the full sequence
      setTimeout(() => {
        navigate("/");
      }, TOTAL_MS);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  const angle = arrow
    ? (Math.atan2(arrow.endY - arrow.startY, arrow.endX - arrow.startX) * 180) /
      Math.PI
    : 0;

  return (
    <div className={styles.page}>
      <div className={`glass-panel ${styles.card}`}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Log in to your ShopEase account</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            ref={buttonRef}
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.footerLink}>
            Sign up
          </Link>
        </p>
      </div>

      {arrow && (
        <div
          className={`${styles.arrow} ${arrowFading ? styles.arrowFade : ""}`}
          style={{
            left: arrow.startX,
            top: arrow.startY,
            width: ARROW_SIZE,
            height: ARROW_SIZE,
            marginLeft: -ARROW_SIZE / 2,
            marginTop: -ARROW_SIZE / 2,
            transform: arrowMoved
              ? `translate(${arrow.endX - arrow.startX}px, ${
                  arrow.endY - arrow.startY
                }px) rotate(${angle}deg)`
              : "translate(0, 0) rotate(0deg)",
          }}
        >
          <span className={styles.arrowTrail}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default Login;
