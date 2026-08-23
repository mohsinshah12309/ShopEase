const express = require("express");
const router = express.Router();
const {
  createOrder,
  confirmPayment,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  completeOrder,
} = require("../controllers/orderController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Private routes
router.post("/", verifyToken, createOrder);
router.post("/:id/pay", verifyToken, confirmPayment);

// Note: GET /my and GET / must be defined before GET /:id
// so Express doesn't treat "my" as an :id param
router.get("/my", verifyToken, getMyOrders);
router.get("/", verifyToken, isAdmin, getAllOrders);
router.get("/:id", verifyToken, getOrderById);

router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);
router.put("/:id/complete", verifyToken, isAdmin, completeOrder);
router.delete("/:id", verifyToken, cancelOrder);

module.exports = router;
