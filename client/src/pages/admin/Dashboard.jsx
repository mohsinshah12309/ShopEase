import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../api/axios";
import styles from "./Dashboard.module.css";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);

// Count-up animation (design.md §7): animates from 0 to `target` over
// `duration` ms with an ease-out curve once the target value arrives.
function useCountUp(target, duration = 400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target == null) return undefined;
    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipLabel}>{label}</span>
      <span className={styles.tooltipValue}>
        {formatCurrency(payload[0].value)}
      </span>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        if (mounted) setStats(data.stats || {});
      } catch {
        if (mounted) setStats({});
      } finally {
        if (mounted) setStatsLoading(false);
      }
    };

    const fetchChart = async () => {
      try {
        const { data } = await api.get("/admin/revenue-chart");
        if (mounted) {
          const formatted = (data.chartData || []).map((item) => ({
            ...item,
            label:
              `${MONTH_NAMES[(item.month || 1) - 1]} ${item.year || ""}`.trim(),
          }));
          setChartData(formatted);
        }
      } catch {
        if (mounted) setChartData([]);
      } finally {
        if (mounted) setChartLoading(false);
      }
    };

    fetchStats();
    fetchChart();
    return () => {
      mounted = false;
    };
  }, []);

  // Targets stay null until stats finish loading, so each number animates
  // 0 → final value exactly once, when it first appears.
  const revenueCount = useCountUp(
    statsLoading ? null : stats.totalRevenue || 0,
  );
  const ordersCount = useCountUp(
    statsLoading ? null : (stats.totalOrders ?? 0),
  );
  const productsCount = useCountUp(
    statsLoading ? null : (stats.totalProducts ?? 0),
  );
  const customersCount = useCountUp(
    statsLoading ? null : (stats.totalCustomers ?? 0),
  );

  const statCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(revenueCount),
      accent: true,
    },
    { label: "Total Orders", value: ordersCount },
    { label: "Total Products", value: productsCount },
    { label: "Total Customers", value: customersCount },
  ];

  const quickLinks = [
    {
      to: "/admin/products",
      label: "Products",
      description: "Manage inventory & units",
    },
    {
      to: "/admin/categories",
      label: "Categories",
      description: "Manage product categories",
    },
    {
      to: "/admin/orders",
      label: "Orders",
      description: "View and update orders",
    },
    { to: "/admin/users", label: "Users", description: "Manage customers" },
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      <div className={styles.statsGrid}>
        {statCards.map((card) => (
          <div key={card.label} className={`glass-panel ${styles.statCard}`}>
            <span className={styles.statLabel}>{card.label}</span>
            {statsLoading ? (
              <div className={styles.skeleton} />
            ) : (
              <span
                className={`${styles.statValue} ${card.accent ? styles.statAccent : ""}`}
              >
                {card.value}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className={`glass-panel ${styles.chartPanel}`}>
        <h2 className={styles.chartTitle}>Sales — Last 6 Months</h2>
        {chartLoading ? (
          <div className={styles.chartSkeleton} />
        ) : (
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--glass-border)"
                  strokeOpacity={0.4}
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--glass-border)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
                />
                <Bar
                  dataKey="revenue"
                  fill="var(--accent)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className={styles.quickGrid}>
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`glass-panel ${styles.quickCard}`}
          >
            <span className={styles.quickLabel}>{link.label}</span>
            <span className={styles.quickDescription}>{link.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
