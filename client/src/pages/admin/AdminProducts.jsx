import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import styles from "./AdminProducts.module.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchProducts = async (pageNum = 1, searchTerm = "") => {
    try {
      setLoading(true);
      const { data } = await api.get("/products", {
        params: { page: pageNum, limit: 15, search: searchTerm || undefined },
      });
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(1, search);
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete "${product.name}"?`);
    if (!confirmed) return;

    try {
      await api.delete(`/products/${product._id}`);
      fetchProducts(page, search);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  const formatUnits = (product) => {
    if (!product.units || product.units.length === 0) return "—";
    return product.units
      .map((u) => `${u.label}${u.isDefault ? " ★" : ""}: $${u.price}`)
      .join(", ");
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <Link to="/admin/products/create" className={styles.addBtn}>
          + Add Product
        </Link>
      </div>

      <form onSubmit={handleSearchSubmit} className={styles.searchRow}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn}>
          Search
        </button>
      </form>

      {loading ? (
        <div className={styles.loaderWrap}>
          <Loader size="large" />
        </div>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : products.length === 0 ? (
        <div className={`glass-panel ${styles.empty}`}>
          <p>No products found. Create your first one above.</p>
        </div>
      ) : (
        <div className={`glass-panel ${styles.tableWrap}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Units / Price</th>
                <th>Availability</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className={styles.thumb}
                    />
                  </td>
                  <td className={styles.nameCell}>{product.name}</td>
                  <td>{product.category?.name || "—"}</td>
                  <td className={styles.unitsCell}>{formatUnits(product)}</td>
                  <td className={product.stock === 0 ? styles.outOfStock : ""}>
                    {product.stock === 0 ? "Out of stock" : "In stock"}
                  </td>
                  <td>{product.isFeatured ? "Yes" : "No"}</td>
                  <td className={styles.actionsCell}>
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className={styles.editBtn}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(product)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className={styles.pageBtn}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
