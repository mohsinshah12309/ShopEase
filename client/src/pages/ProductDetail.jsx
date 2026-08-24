import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import StarRating from "../components/StarRating";
import ReviewCard from "../components/ReviewCard";
import Product3DViewer from "../components/3d/Product3DViewer";
import styles from "./ProductDetail.module.css";

function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [viewMode, setViewMode] = useState("2d");
  const [quantity, setQuantity] = useState(1);
  // Which selling units are checked for add-to-cart: { [label]: quantity }
  const [unitSelections, setUnitSelections] = useState({});
  const [addedMessage, setAddedMessage] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Pre-check the default selling unit so the common case is one click
  function buildInitialSelections(prod) {
    const selections = {};
    if (Array.isArray(prod?.units) && prod.units.length > 0) {
      const def = prod.units.find((u) => u.isDefault) || prod.units[0];
      if (def && def.stock > 0) selections[def.label] = 1;
    }
    return selections;
  }

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
      setActiveImage(0);
      setQuantity(1);
      setUnitSelections(buildInitialSelections(data.product));
    } catch {
      setError("Product not found");
      setProduct(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/products/${id}`);
        if (mounted) {
          setProduct(data.product);
          setActiveImage(0);
          setQuantity(1);
          setUnitSelections(buildInitialSelections(data.product));
        }
      } catch {
        if (mounted) {
          setError("Product not found");
          setProduct(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={`glass-panel ${styles.loadingBlock}`} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <p className={styles.errorText}>{error || "Product not found"}</p>
        <Link to="/products" className={styles.backLink}>
          Back to products
        </Link>
      </div>
    );
  }

  const hasDiscount =
    product.discountPrice != null &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;
  const outOfStock = product.stock === 0;
  const images = product.images || [];
  const currentImage = images[activeImage] || "";

  const handleQuantityChange = (value) => {
    const clamped = Math.max(1, Math.min(value, product.stock));
    setQuantity(clamped);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  const toggleUnit = (label) => {
    setUnitSelections((prev) => {
      const next = { ...prev };
      if (next[label]) delete next[label];
      else next[label] = 1;
      return next;
    });
  };

  const setUnitQty = (label, qty) => {
    const unit = product.units?.find((u) => u.label === label);
    if (!unit) return;
    const clamped = Math.max(1, Math.min(qty, unit.stock));
    setUnitSelections((prev) => ({ ...prev, [label]: clamped }));
  };

  const selectedUnitCount = Object.keys(unitSelections).length;

  const handleAddSelectedToCart = () => {
    Object.entries(unitSelections).forEach(([label, qty]) => {
      if (qty > 0) addToCart(product, qty, label);
    });
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  const hasReviewed = product.reviews?.some(
    (review) => review.user?._id === user?.id,
  );

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      setReviewError("Please select a rating");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError("Please write a comment");
      return;
    }

    setReviewSubmitting(true);
    setReviewError("");
    try {
      await api.post(`/products/${id}/review`, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviewRating(0);
      setReviewComment("");
      await fetchProduct();
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await api.delete(`/products/${id}/review`);
      await fetchProduct();
    } catch {
      // silently ignore delete errors
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* Left column — image gallery & 3D WebGL viewer */}
        <div className={styles.gallery}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <button
              type="button"
              onClick={() => setViewMode("2d")}
              style={{
                flex: 1,
                padding: "8px 16px",
                borderRadius: "10px",
                border: viewMode === "2d" ? "1px solid var(--accent)" : "1px solid rgba(255,255,255,0.1)",
                background: viewMode === "2d" ? "rgba(139, 92, 246, 0.2)" : "rgba(255,255,255,0.04)",
                color: viewMode === "2d" ? "#fff" : "var(--text-secondary)",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              🖼️ Photo View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              style={{
                flex: 1,
                padding: "8px 16px",
                borderRadius: "10px",
                border: viewMode === "3d" ? "1px solid #06b6d4" : "1px solid rgba(255,255,255,0.1)",
                background: viewMode === "3d" ? "rgba(6, 182, 212, 0.2)" : "rgba(255,255,255,0.04)",
                color: viewMode === "3d" ? "#06b6d4" : "var(--text-secondary)",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              🌐 3D Interactive View
            </button>
          </div>

          {viewMode === "3d" ? (
            <Product3DViewer productName={product.name} imageUrl={currentImage || product.images?.[0]} />
          ) : (
            <>
              <div className={`glass-panel ${styles.mainImageFrame}`}>
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className={styles.mainImage}
                  />
                ) : (
                  <div className={styles.noImage}>No image</div>
                )}
              </div>

              {images.length > 1 && (
                <div className={styles.thumbnails}>
                  {images.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`${styles.thumbnail} ${
                        index === activeImage ? styles.thumbnailActive : ""
                      }`}
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img src={img} alt="" className={styles.thumbnailImage} />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right column — product info */}
        <div className={styles.info}>
          <h1 className={styles.name}>{product.name}</h1>

          <div className={styles.ratingRow}>
            <StarRating rating={product.ratings || 0} size="small" />
            <span className={styles.numReviews}>
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          <div className={styles.priceRow}>
            {hasDiscount ? (
              <>
                <span className={styles.discountPrice}>
                  ${product.discountPrice.toFixed(2)}
                </span>
                <span className={styles.originalPrice}>
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className={styles.price}>${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className={styles.description}>{product.description}</p>

          <p
            className={`${styles.stockStatus} ${
              outOfStock ? styles.outOfStock : styles.inStock
            }`}
          >
            {outOfStock ? "Out of Stock" : "In Stock"}
          </p>

          {!outOfStock &&
            (Array.isArray(product.units) && product.units.length > 0 ? (
              /* Multi-unit picker: check every selling unit you want,
                 set a quantity per unit, then add them all at once. */
              <div className={styles.unitsPanel}>
                <h3 className={styles.unitsTitle}>Select selling units</h3>

                {product.units.map((unitItem) => {
                  const checked = Boolean(unitSelections[unitItem.label]);
                  const soldOut = unitItem.stock === 0;
                  const qty = unitSelections[unitItem.label] || 1;

                  return (
                    <div
                      key={unitItem.label}
                      className={`${styles.unitRow} ${
                        checked ? styles.unitRowSelected : ""
                      } ${soldOut ? styles.unitRowDisabled : ""}`}
                    >
                      <label className={styles.unitCheck}>
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={soldOut}
                          onChange={() => toggleUnit(unitItem.label)}
                        />
                        <span className={styles.unitLabel}>
                          {unitItem.label}
                          {unitItem.isDefault && (
                            <em className={styles.defaultTag}>Default</em>
                          )}
                        </span>
                      </label>

                      <span className={styles.unitPrice}>
                        ${unitItem.price.toFixed(2)}
                      </span>

                      <span
                        className={`${styles.unitStock} ${
                          soldOut ? styles.outOfStock : styles.inStock
                        }`}
                      >
                        {soldOut ? "Out of stock" : "In stock"}
                      </span>

                      {checked && !soldOut && (
                        <div className={styles.stepper}>
                          <button
                            type="button"
                            className={styles.stepBtn}
                            onClick={() => setUnitQty(unitItem.label, qty - 1)}
                            disabled={qty <= 1}
                            aria-label={`Decrease ${unitItem.label} quantity`}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            className={styles.quantityInput}
                            value={qty}
                            min="1"
                            max={unitItem.stock}
                            onChange={(e) =>
                              setUnitQty(
                                unitItem.label,
                                parseInt(e.target.value, 10) || 1,
                              )
                            }
                            aria-label={`${unitItem.label} quantity`}
                          />
                          <button
                            type="button"
                            className={styles.stepBtn}
                            onClick={() => setUnitQty(unitItem.label, qty + 1)}
                            disabled={qty >= unitItem.stock}
                            aria-label={`Increase ${unitItem.label} quantity`}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  type="button"
                  className={styles.addToCartBtn}
                  onClick={handleAddSelectedToCart}
                  disabled={selectedUnitCount === 0}
                >
                  {selectedUnitCount > 0
                    ? `Add ${selectedUnitCount} Unit${
                        selectedUnitCount > 1 ? "s" : ""
                      } to Cart`
                    : "Add to Cart"}
                </button>
              </div>
            ) : (
              /* Legacy fallback for products without selling units */
              <div className={styles.quantityRow}>
                <div className={styles.stepper}>
                  <button
                    type="button"
                    className={styles.stepBtn}
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className={styles.quantityInput}
                    value={quantity}
                    min="1"
                    max={product.stock}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value, 10) || 1)
                    }
                    aria-label="Quantity"
                  />
                  <button
                    type="button"
                    className={styles.stepBtn}
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className={styles.addToCartBtn}
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                >
                  Add to Cart
                </button>
              </div>
            ))}

          {addedMessage && <p className={styles.addedMessage}>Added to cart</p>}
        </div>
      </div>

      {/* Reviews section */}
      <section className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>
          Reviews ({product.numReviews || 0})
        </h2>

        {product.reviews && product.reviews.length > 0 ? (
          <div className={styles.reviewsList}>
            {product.reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                isOwn={review.user?._id === user?.id}
                onDelete={handleDeleteReview}
              />
            ))}
          </div>
        ) : (
          <p className={styles.noReviews}>No reviews yet</p>
        )}

        {user ? (
          !hasReviewed ? (
            <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
              <h3 className={styles.formTitle}>Leave a review</h3>

              <div className={styles.formRating}>
                <StarRating rating={reviewRating} onRate={setReviewRating} />
              </div>

              <textarea
                className={styles.commentInput}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                rows={4}
              />

              {reviewError && (
                <p className={styles.reviewError}>{reviewError}</p>
              )}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <p className={styles.reviewedPrompt}>
              You have already reviewed this product
            </p>
          )
        ) : (
          <p className={styles.loginPrompt}>
            <Link to="/login" className={styles.loginLink}>
              Log in
            </Link>{" "}
            to leave a review
          </p>
        )}
      </section>
    </div>
  );
}

export default ProductDetail;
