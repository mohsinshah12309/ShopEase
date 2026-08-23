import styles from "./About.module.css";

function About() {
  return (
    <div className={styles.page}>
      <div className={`glass-panel ${styles.card}`}>
        <h1 className={styles.title}>About Us</h1>

        <p className={styles.paragraph}>
          ShopEase is an online medical store built around one simple promise:
          genuine medicines and health products, delivered to your door with
          speed and care. We work directly with licensed suppliers and
          registered pharmacies to make sure every item on our shelves is
          authentic, properly stored, and safe to use.
        </p>

        <p className={styles.paragraph}>
          From everyday essentials like vitamins, first-aid supplies, and
          personal care to prescription medicines, our catalog is curated by
          qualified pharmacists. Before a product ever appears on our site, it
          is checked against verified sourcing records and batch details. If an
          item requires a prescription, we ask you to provide a valid one at
          checkout — we never sidestep the rules that keep you safe.
        </p>

        <p className={styles.paragraph}>
          Convenience is at the heart of everything we do. Order in under a
          minute, track your package in real time, and have it delivered within
          hours in most cities. Our customer support team, reachable by phone,
          email, or WhatsApp, is staffed by real people who understand both
          medicine and service.
        </p>

        <p className={styles.paragraph}>
          Whether you are restocking a home medicine cabinet or managing a
          long-term condition, we are here to make healthcare simpler, more
          reliable, and more accessible — one order at a time.
        </p>
      </div>
    </div>
  );
}

export default About;
