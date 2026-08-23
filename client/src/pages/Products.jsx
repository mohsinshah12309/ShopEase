import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";
import styles from "./Products.module.css";

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "top-rated", label: "Top Rated" },
];

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const debounceRef = useRef(null);

  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;

  // Fetch categories once on mount
  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        if (mounted) setCategories(data.categories || []);
      } catch {
        if (mounted) setCategories([]);
      }
    };
    fetchCategories();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch products whenever search params change
  useEffect(() => {
    let mounted = true;

    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products?${params.toString()}`);
        if (mounted) {
          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
          setTotalProducts(data.totalProducts || 0);
        }
      } catch {
        if (mounted) {
          setProducts([]);
          setTotalPages(1);
          setTotalProducts(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      mounted = false;
    };
  }, [category, brand, search, sort, page]);

  // Debounced search input -> update search param
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (value) {
        next.set("search", value);
      } else {
        next.delete("search");
      }
      next.delete("page");
      setSearchParams(next);
    }, 400);
  };

  const handleCategoryChange = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug) {
      next.set("category", slug);
    } else {
      next.delete("category");
    }
    next.delete("page");
    setSearchParams(next);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set("sort", value);
    } else {
      next.delete("sort");
    }
    next.delete("page");
    setSearchParams(next);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(newPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = Boolean(category || brand || search || sort);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.resultCount}>
          {loading ? "Loading..." : `${totalProducts} products found`}
        </p>
      </div>

      <button
        type="button"
        className={styles.filterToggle}
        onClick={() => setFiltersOpen(true)}
      >
        Filters
      </button>

      {filtersOpen && (
        <div
          className={styles.overlay}
          onClick={() => setFiltersOpen(false)}
          role="presentation"
        />
      )}

      <div className={styles.layout}>
        <aside
          className={`glass-panel ${styles.sidebar} ${
            filtersOpen ? styles.sidebarOpen : ""
          }`}
        >
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Filters</h2>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
            >
              ×
            </button>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="search-input">
              Search
            </label>
            <input
              id="search-input"
              type="text"
              className={styles.searchInput}
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search products..."
            />
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Category</span>
            <div className={styles.categoryList}>
              <label className={styles.categoryOption}>
                <input
                  type="radio"
                  name="category"
                  checked={!category}
                  onChange={() => handleCategoryChange("")}
                />
                <span>All</span>
              </label>
              {categories.map((cat) => (
                <label key={cat._id} className={styles.categoryOption}>
                  <input
                    type="radio"
                    name="category"
                    checked={category === cat.slug}
                    onChange={() => handleCategoryChange(cat.slug)}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="sort-select">
              Sort
            </label>
            <select
              id="sort-select"
              className={styles.sortSelect}
              value={sort}
              onChange={handleSortChange}
            >
              <option value="">Default</option>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClearFilters}
            >
              Clear filters
            </button>
          )}
        </aside>

        <main className={styles.main}>
          <ProductGrid products={products} loading={loading} />
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default Products;
