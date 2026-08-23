import styles from "./Terms.module.css";

function Terms() {
  return (
    <div className={styles.page}>
      <div className={`glass-panel ${styles.card}`}>
        <h1 className={styles.title}>Terms & Conditions</h1>
        <p className={styles.intro}>
          These terms and conditions explain how ShopEase operates as an online
          medical store and outline your rights and responsibilities when you
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
            2. Prescriptions & Product Authenticity
          </h2>
          <p className={styles.paragraph}>
            Certain medicines sold on this site require a valid prescription
            from a licensed healthcare professional. If a product is marked as
            prescription-only, you must provide a valid prescription before we
            can dispatch it. We reserve the right to refuse or cancel any order
            that does not include the required prescription.
          </p>
          <p className={styles.paragraph}>
            We source all products through licensed suppliers and registered
            pharmacies, and we only stock genuine, authentic medicines. That
            said, the information provided on this site is for general guidance
            only and does not replace professional medical advice. Always
            consult your doctor or pharmacist before starting, stopping, or
            changing any medication.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Returns & Refunds</h2>
          <p className={styles.paragraph}>
            For health and safety reasons, we cannot accept returns of
            medicines, supplements, or other health products that have been
            opened or unsealed. If you receive a damaged, incorrect, or
            defective item, please contact us within 7 days of delivery and we
            will arrange a replacement or a full refund. Refunds are processed
            back to the original payment method within 5–7 business days once
            approved.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Limitation of Liability</h2>
          <p className={styles.paragraph}>
            To the fullest extent permitted by law, ShopEase is not liable for
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
