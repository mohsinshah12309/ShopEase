const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { upload, uploadToCloudinary } = require("../middleware/upload");

// Public routes
router.get("/", getCategories);

// Admin routes
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  uploadToCloudinary,
  createCategory,
);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  uploadToCloudinary,
  updateCategory,
);
router.delete("/:id", verifyToken, isAdmin, deleteCategory);

module.exports = router;
