import styles from "./Terms.module.css";

function Terms() {
  return (
    <div className={styles.page}>
      <div className={`glass-panel ${styles.card}`}>
        <h1 className={styles.title}>Terms & Conditions</h1>
        <p className={styles.intro}>
          These terms and conditions explain how Nexura operates as an online
          store and outline your rights and responsibilities when you
          order from us. Please read them carefully before placing an order.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Orders & Payment</h2>
          <p className={styles.paragraph}>
            All orders placed on our website are subject to availability and
            confirmation. We accept payment through the methods shown at
            checkout, and your order is confirmed once payment has been
            successfully processed. Prices are listed in the local currency and
            may change without prior notice, but the price shown at the time you
            place your order is the price you pay.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            2. Product Quality & Authenticity
          </h2>
          <p className={styles.paragraph}>
            Nexura is dedicated to providing high-quality, authentic products. We source
            all merchandise through licensed distributors and verified manufacturers.
            Product specifications and descriptions on our website are provided to the
            best of our knowledge, but we do not warrant that product descriptions are
            completely free of error.
          </p>
          <p className={styles.paragraph}>
            Information provided on this site is for general shopping and browsing
            guidance only. Always follow the manufacturer instructions and safety manuals
            provided directly with the physical products.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Returns & Refunds</h2>
          <p className={styles.paragraph}>
            For hygiene and safety reasons, certain categories of items such as cosmetics,
            opened personal care goods, and intimate wear cannot be returned once opened.
            For all other eligible items, if you receive a damaged, incorrect, or
            defective item, please contact us within 7 days of delivery and we
            will arrange a replacement or a full refund. Refunds are processed
            back to the original payment method within 5–7 business days once
            approved.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Limitation of Liability</h2>
          <p className={styles.paragraph}>
            To the fullest extent permitted by law, Nexura is not liable for
            any indirect, incidental, or consequential damages arising from the
            use of our website or the products purchased through it. Our total
            liability for any claim related to an order is limited to the amount
            you paid for that order. Nothing in these terms affects your
            statutory rights under consumer protection law.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Terms;
