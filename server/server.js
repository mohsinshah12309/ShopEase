const dotenv = require("dotenv");
dotenv.config();

// console.log("Cloudinary config check:", {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   secret_length: process.env.CLOUDINARY_API_SECRET?.length,
// });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const { notFound, errorHandler } = require("./middleware/errorHandler.js");

const { apiLimiter, authLimiter, checkoutLimiter } = require("./middleware/rateLimiter.js");

const authRoutes = require("./routes/authRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");

const app = express();

// Trust proxy if deployed behind proxy (e.g. Vercel/Render)
app.set("trust proxy", 1);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
  }),
);

// Apply Global API Rate Limiter
app.use("/api", apiLimiter);

// Routes with specialized limiters
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/orders", checkoutLimiter, orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

// Error handling middleware (after all routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
