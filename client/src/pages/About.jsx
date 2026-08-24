import styles from "./About.module.css";

function About() {
  return (
    <div className={styles.page}>
      <div className={`glass-panel ${styles.card}`}>
        <h1 className={styles.title}>About Us</h1>

        <p className={styles.paragraph}>
          Nexura is a next-generation, premium e-commerce platform built to bring you everything you need in one place. We offer a curated collection of high-quality products across multiple categories, including toys and games, fashion for all ages, the latest tech and gadgets, home goods, beauty essentials, books, and premium footwear. We work directly with verified manufacturers and licensed suppliers to ensure that every single item we offer is 100% authentic, high-quality, and priced fairly.
        </p>

        <p className={styles.paragraph}>
          Our selection is constantly updated by our trend-spotting team, ensuring that you have access to the latest styles and innovations. From everyday essentials to unique finds, our catalog is curated with strict quality checks. Before any product ever appears on our site, it is inspected to meet our high standards.
        </p>

        <p className={styles.paragraph}>
          Convenience is at the heart of everything we do. Order in under a
          minute, track your package in real time, and have it delivered to your doorstep.
          Our customer support team is staffed by real people who are ready to help you
          with any questions or concerns you might have.
        </p>

        <p className={styles.paragraph}>
          Whether you are looking for the perfect gift, updating your wardrobe, or
          upgrading your home tech, we are here to make online shopping simpler, more
          reliable, and more accessible — one order at a time.
        </p>
      </div>
    </div>
  );
}

export default About;
