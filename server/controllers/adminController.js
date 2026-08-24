const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Message = require("../models/Message");

// Get dashboard statistics
const getStats = async (req, res, next) => {
  try {
    const [revenueResult, totalOrders, totalProducts, totalCustomers, totalMessages, unreadMessages] =
      await Promise.all([
        Order.aggregate([
          { $match: { isPaid: true } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
        Order.countDocuments(),
        Product.countDocuments(),
        User.countDocuments({ role: "customer" }),
        Message.countDocuments(),
        Message.countDocuments({ status: "unread" }),
      ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        totalMessages,
        unreadMessages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get revenue data for the last 6 months for the chart
const getRevenueChart = async (req, res, next) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const results = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          paidAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$paidAt" },
            month: { $month: "$paidAt" },
          },
          revenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Build a map of existing data keyed by "year-month"
    const revenueMap = new Map();
    results.forEach((item) => {
      revenueMap.set(`${item._id.year}-${item._id.month}`, {
        month: item._id.month,
        year: item._id.year,
        revenue: item.revenue,
      });
    });

    // Generate the last 6 months (including current month) and fill gaps
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const key = `${year}-${month}`;

      chartData.push(
        revenueMap.get(key) || {
          month,
          year,
          revenue: 0,
        },
      );
    }

    res.status(200).json({
      success: true,
      chartData,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (customers and admins), optionally filtered by ?role=
const getAllUsers = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.role && ["customer", "admin"].includes(req.query.role)) {
      filter.role = req.query.role;
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new admin account directly
const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Password is hashed automatically by the pre-save hook on the User model
    const user = await User.create({ name, email, password, role: "admin" });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update a user's role (promote a customer to admin or demote an admin to customer)
const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { role } = req.body;

    if (!role || !["customer", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'customer' or 'admin'",
      });
    }

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a user
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete an admin account",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    next(error);
  }
};

// Get all customer contact messages
const getAllMessages = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && ["unread", "read"].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    const messages = await Message.find(filter).sort({ createdAt: -1 });
    const unreadCount = await Message.countDocuments({ status: "unread" });

    res.status(200).json({
      success: true,
      messages,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

// Update message status (read / unread)
const updateMessageStatus = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const { status } = req.body;
    if (status && ["unread", "read"].includes(status)) {
      message.status = status;
    } else {
      // toggle
      message.status = message.status === "unread" ? "read" : "unread";
    }

    await message.save();

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a message
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getRevenueChart,
  getAllUsers,
  createAdmin,
  updateUserRole,
  deleteUser,
  getAllMessages,
  updateMessageStatus,
  deleteMessage,
};
