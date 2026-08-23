import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductGrid from "../components/ProductGrid";
import styles from "./Home.module.css";

// Bento slot order (design.md §5): one large 2×2 featured tile, smaller
// tiles around it, then a wide 2×1 tile. Categories beyond these five
// slots auto-place into implicit rows below the bento grid.
const BENTO_AREA_CLASSES = [
  styles.tileFeatured,
  styles.tileSmallA,
  styles.tileSmallB,
  styles.tileSmallC,
  styles.tileWide,
];

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchFeatured = async () => {
      try {
        const { data } = await api.get("/products/featured");
        if (mounted) {
          setFeaturedProducts(data.products || []);
        }
      } catch {
        if (mounted) setFeaturedProducts([]);
      } finally {
        if (mounted) setFeaturedLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        if (mounted) {
          setCategories(data.categories || []);
        }
      } catch {
        if (mounted) setCategories([]);
      } finally {
        if (mounted) setCategoriesLoading(false);
      }
    };

    fetchFeatured();
    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={`glass-panel ${styles.heroShape} ${styles.shapeOne}`} />
        <div className={`glass-panel ${styles.heroShape} ${styles.shapeTwo}`} />
        <div
          className={`glass-panel ${styles.heroShape} ${styles.shapeThree}`}
        />

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Discover quality products for every part of your life
          </h1>
          <p className={styles.heroSubtitle}>
            From everyday essentials to standout finds, we bring you a curated
            selection of well-made goods at fair prices — with fast shipping and
            easy returns on every order.
          </p>
          <Link to="/products" className={styles.ctaButton}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured products */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Featured</h2>
        <ProductGrid products={featuredProducts} loading={featuredLoading} />
      </section>

      {/* Categories */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
        {categoriesLoading ? (
          <div className={styles.categoryGrid}>
            {Array.from({ length: BENTO_AREA_CLASSES.length }, (_, i) => (
              <div
                key={i}
                className={`glass-panel ${styles.categorySkeleton} ${BENTO_AREA_CLASSES[i]}`}
              />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className={styles.categoryGrid}>
            {categories.map((category, index) => (
              <Link
                key={category._id}
                to={`/products?category=${category.slug}`}
                className={`glass-panel ${styles.categoryCard} ${
                  index < BENTO_AREA_CLASSES.length
                    ? BENTO_AREA_CLASSES[index]
                    : ""
                }`}
              >
                <div
                  className={styles.categoryImage}
                  style={{
                    backgroundImage: category.image
                      ? `url(${category.image})`
                      : undefined,
                  }}
                />
                <div className={styles.categoryScrim} />
                <span className={styles.categoryName}>{category.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.emptyCategories}>No categories available</p>
        )}
      </section>
    </div>
  );
}

export default Home;
