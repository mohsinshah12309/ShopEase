import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import api from "../api/axios";
import Loader from "./Loader";
import styles from "./CheckoutForm.module.css";

const cardElementOptions = {
  style: {
    base: {
      color: "#EDEEF0",
      fontFamily: "Inter, sans-serif",
      fontSize: "16px",
      "::placeholder": {
        color: "#6b6f76",
      },
    },
    invalid: {
      color: "#f87171",
      iconColor: "#f87171",
    },
  },
};

function CheckoutForm({ clientSecret, orderId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed. Please try again.");
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await api.post(`/orders/${orderId}/pay`);
        onSuccess();
      } else {
        setError("Payment was not completed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while processing your payment. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={`glass-panel ${styles.cardPanel}`}>
        <CardElement options={cardElementOptions} />
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className={styles.payBtn}
        disabled={!stripe || !elements || isProcessing}
      >
        {isProcessing ? <Loader size="small" /> : "Pay Now"}
      </button>
    </form>
  );
}

export default CheckoutForm;
