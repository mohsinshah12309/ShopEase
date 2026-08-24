const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware.js");
const adminController = require("../controllers/adminController.js");

// Apply both middleware to all routes in this router
router.use(verifyToken, isAdmin);

router.get("/stats", adminController.getStats);
router.get("/revenue-chart", adminController.getRevenueChart);
router.get("/users", adminController.getAllUsers);
router.post("/users", adminController.createAdmin);
router.put("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);

// Admin Messages
router.get("/messages", adminController.getAllMessages);
router.patch("/messages/:id", adminController.updateMessageStatus);
router.delete("/messages/:id", adminController.deleteMessage);

module.exports = router;
