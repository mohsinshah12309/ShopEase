import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductGrid from "../components/ProductGrid";
import Hero3DCanvas from "../components/3d/Hero3DCanvas";
import TiltCard3D from "../components/3d/TiltCard3D";
import styles from "./Home.module.css";

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
      {/* 3D Interactive WebGL Hero */}
      <section className={styles.hero}>
        <Hero3DCanvas />

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            <span>Next-Gen 3D E-Commerce Showcase</span>
          </div>

          <h1 className={styles.heroTitle}>
            Discover Curated Goods in <span className="glow-text">Full 3D Space</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Immerse yourself in an ultra-modern shopping experience. Interactive WebGL 3D previews, real-time spatial tilt, fast global shipping, and zero friction.
          </p>

          <div className={styles.heroActions}>
            <Link to="/products" className={styles.ctaButton}>
              Explore Collection
            </Link>
            <a href="#featured-section" className={styles.secondaryButton}>
              View Featured
            </a>
          </div>

          {/* Stats Bar */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10k+</span>
              <span className={styles.statLabel}>Happy Customers</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>99.9%</span>
              <span className={styles.statLabel}>Uptime & Speed</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>3D</span>
              <span className={styles.statLabel}>Interactive WebGL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured-section" className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <span className="badge-3d">Curated Selection</span>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
          </div>
          <Link to="/products" className={styles.viewAllLink}>
            View All Products &rarr;
          </Link>
        </div>
        <ProductGrid products={featuredProducts} loading={featuredLoading} />
      </section>

      {/* Categories Bento Grid */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <span className="badge-3d">Browse Categories</span>
            <h2 className={styles.sectionTitle}>Shop by Category</h2>
          </div>
        </div>

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
              <TiltCard3D
                key={category._id}
                intensity={16}
                className={`${BENTO_AREA_CLASSES[index] || ""}`}
              >
                <Link
                  to={`/products?category=${category.slug}`}
                  className={`glass-panel ${styles.categoryCard}`}
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
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryBadge}>Category</span>
                    <span className={styles.categoryName}>{category.name}</span>
                  </div>
                </Link>
              </TiltCard3D>
            ))}
          </div>
        ) : (
          <p className={styles.emptyCategories}>No categories available right now</p>
        )}
      </section>
    </div>
  );
}

export default Home;
