import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import styles from "./AdminCategories.module.css";

const emptyForm = { name: "", image: null };

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/categories");
      setCategories(data.categories || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImagePreview(null);
    setFormError("");
    setFormOpen(true);
  };

  const openEditForm = (category) => {
    setEditingId(category._id);
    setForm({ name: category.name, image: null });
    setImagePreview(category.image || null);
    setFormError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setImagePreview(null);
    setFormError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("Category name is required");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      if (form.image) fd.append("image", form.image);

      if (editingId) {
        await api.put(`/categories/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/categories", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      closeForm();
      fetchCategories();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Failed to save category — please try again",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Delete "${category.name}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      await api.delete(`/categories/${category._id}`);
      fetchCategories();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete category — it may still have products assigned",
      );
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Categories</h1>
        <button
          type="button"
          className={styles.addBtn}
          onClick={openCreateForm}
        >
          + Add Category
        </button>
      </div>

      {formOpen && (
        <div className={`glass-panel ${styles.formPanel}`}>
          <h2 className={styles.formTitle}>
            {editingId ? "Edit Category" : "New Category"}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="catName">Name</label>
              <input
                id="catName"
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Pain Relief"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="catImage">Banner Image (optional)</label>
              <input
                id="catImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={styles.preview}
                />
              )}
            </div>

            {formError && <p className={styles.formError}>{formError}</p>}

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={closeForm}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className={styles.loaderWrap}>
          <Loader size="large" />
        </div>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : categories.length === 0 ? (
        <div className={`glass-panel ${styles.empty}`}>
          <p>No categories yet. Create your first one above.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {categories.map((category) => (
            <div key={category._id} className={`glass-panel ${styles.card}`}>
              <div
                className={styles.thumb}
                style={
                  category.image
                    ? { backgroundImage: `url(${category.image})` }
                    : undefined
                }
              >
                {!category.image && (
                  <span className={styles.noImage}>No image</span>
                )}
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardName}>{category.name}</span>
                <span className={styles.cardSlug}>{category.slug}</span>
              </div>
              <div className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={() => openEditForm(category)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(category)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCategories;
