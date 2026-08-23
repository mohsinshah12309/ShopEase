import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import styles from "./ProductForm.module.css";

// When admin marks a unit "In Stock" without a prior quantity, it is
// provisioned with this internal amount. Admins manage availability
// (in/out of stock) — not exact quantities.
const IN_STOCK_QUANTITY = 999;

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [existingImages, setExistingImages] = useState([]);

  const [units, setUnits] = useState([]);

  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get("/categories"),
        ]);

        const product = productRes.data.product;
        setName(product.name || "");
        setDescription(product.description || "");
        setCategory(product.category?._id || product.category || "");
        setBrand(product.brand || "");
        setDiscountPrice(product.discountPrice ?? "");
        setIsFeatured(!!product.isFeatured);
        setExistingImages(product.images || []);
        setUnits(
          (product.units || []).map((u) => ({
            label: u.label,
            price: u.price,
            stock: u.stock,
            inStock: u.stock > 0,
            isDefault: u.isDefault,
          })),
        );
        setCategories(categoriesRes.data.categories || []);
      } catch (err) {
        setLoadError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setNewImages(files);
    setNewImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const addUnitRow = () => {
    setUnits((prev) => [
      ...prev,
      {
        label: "",
        price: "",
        stock: IN_STOCK_QUANTITY,
        inStock: true,
        isDefault: prev.length === 0,
      },
    ]);
  };

  const removeUnitRow = (index) => {
    setUnits((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length > 0 && !next.some((u) => u.isDefault)) {
        next[0].isDefault = true;
      }
      return next;
    });
  };

  const updateUnit = (index, field, value) => {
    setUnits((prev) =>
      prev.map((u, i) => (i === index ? { ...u, [field]: value } : u)),
    );
  };

  const setDefaultUnit = (index) => {
    setUnits((prev) => prev.map((u, i) => ({ ...u, isDefault: i === index })));
  };

  // Admin only decides In Stock / Out of Stock — never exact quantities.
  const toggleUnitStock = (index, checked) => {
    setUnits((prev) =>
      prev.map((u, i) => {
        if (i !== index) return u;
        if (checked) {
          const current = Number(u.stock);
          return {
            ...u,
            inStock: true,
            stock: current > 0 ? u.stock : IN_STOCK_QUANTITY,
          };
        }
        return { ...u, inStock: false, stock: 0 };
      }),
    );
  };

  const validate = () => {
    if (!name.trim() || name.trim().length < 3) {
      return "Product name must be at least 3 characters";
    }
    if (!description.trim() || description.trim().length < 20) {
      return "Description must be at least 20 characters";
    }
    if (!category) {
      return "Please select a category";
    }
    if (units.length === 0) {
      return "At least one unit (e.g. Strip, Packet) is required";
    }
    for (const u of units) {
      if (!u.label.trim()) return "Every unit needs a label (e.g. 'Strip')";
      if (u.price === "" || Number(u.price) < 0)
        return `Unit "${u.label}" needs a valid price`;
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("description", description.trim());
      fd.append("category", category);
      fd.append("brand", brand.trim());
      fd.append("discountPrice", discountPrice || "");
      fd.append("isFeatured", isFeatured);
      fd.append(
        "units",
        JSON.stringify(
          units.map((u) => ({
            label: u.label.trim(),
            price: Number(u.price),
            stock: u.inStock
              ? Number(u.stock) > 0
                ? Number(u.stock)
                : IN_STOCK_QUANTITY
              : 0,
            isDefault: u.isDefault,
          })),
        ),
      );
      newImages.forEach((file) => fd.append("images", file));

      await api.put(`/products/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/admin/products");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update product — please check the fields and try again",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "64px 0",
          }}
        >
          <Loader size="large" />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{loadError}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Edit Product</h1>

      <form onSubmit={handleSubmit} className={`glass-panel ${styles.form}`}>
        <div className={styles.field}>
          <label htmlFor="name">Product Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="brand">Brand (optional)</label>
            <input
              id="brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="discountPrice">Discount Price (optional)</label>
            <input
              id="discountPrice"
              type="number"
              min="0"
              step="0.01"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
            />
          </div>

          <div className={styles.checkboxField}>
            <label>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              Show on homepage (Featured)
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label>Current Images</label>
          <div className={styles.previewRow}>
            {existingImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Product ${i + 1}`}
                className={styles.preview}
              />
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="images">Add More Images (optional)</label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {newImagePreviews.length > 0 && (
            <div className={styles.previewRow}>
              {newImagePreviews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`New ${i + 1}`}
                  className={styles.preview}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.unitsSection}>
          <div className={styles.unitsHeader}>
            <label>Selling Units</label>
            <button
              type="button"
              className={styles.addUnitBtn}
              onClick={addUnitRow}
            >
              + Add Unit
            </button>
          </div>
          <p className={styles.unitsHint}>
            Add each way this product is sold — e.g. Strip, Packet, Box — with
            its own price. Use Availability to mark it In Stock or Out of Stock.
          </p>

          <div className={styles.unitsTable}>
            <div className={styles.unitsTableHead}>
              <span>Label</span>
              <span>Price</span>
              <span>Availability</span>
              <span>Default</span>
              <span></span>
            </div>
            {units.map((unit, index) => (
              <div key={index} className={styles.unitRow}>
                <input
                  type="text"
                  value={unit.label}
                  onChange={(e) => updateUnit(index, "label", e.target.value)}
                  placeholder="Strip / Packet / Box"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={unit.price}
                  onChange={(e) => updateUnit(index, "price", e.target.value)}
                />
                <label className={styles.stockToggle}>
                  <input
                    type="checkbox"
                    checked={!!unit.inStock}
                    onChange={(e) => toggleUnitStock(index, e.target.checked)}
                  />
                  <span>{unit.inStock ? "In stock" : "Out of stock"}</span>
                </label>
                <label className={styles.defaultCheckbox}>
                  <input
                    type="checkbox"
                    checked={unit.isDefault}
                    onChange={() => setDefaultUnit(index)}
                  />
                </label>
                <button
                  type="button"
                  className={styles.removeUnitBtn}
                  onClick={() => removeUnitRow(index)}
                  disabled={units.length === 1}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate("/admin/products")}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
