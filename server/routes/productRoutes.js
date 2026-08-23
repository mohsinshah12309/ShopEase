const express = require("express");
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  deleteReview,
} = require("../controllers/productController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { upload, uploadToCloudinary } = require("../middleware/upload");

// Public routes
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);

// Admin routes
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.array("images", 5),
  uploadToCloudinary,
  createProduct,
);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.array("images", 5),
  uploadToCloudinary,
  updateProduct,
);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

// Review routes (authenticated users)
router.post("/:id/review", verifyToken, addReview);
router.delete("/:id/review", verifyToken, deleteReview);

module.exports = router;
