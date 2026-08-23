const Stripe = require("stripe");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { sendOrderConfirmationEmail } = require("../utils/email");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Adjust stock for each order item. direction: -1 to deduct, +1 to restore.
// Updates both the product's total stock and the matching selling unit's
// stock (when the item was purchased in a specific unit).
async function adjustUnitsStock(orderItems, direction) {
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: direction * item.quantity },
    });

    if (item.unit) {
      await Product.updateOne(
        { _id: item.product, "units.label": item.unit },
        { $inc: { "units.$.stock": direction * item.quantity } },
      );
    }
  }
}

// @desc    Create a new order (Card via Stripe or Cash on Delivery)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod = "card" } = req.body;
    const method = paymentMethod === "cod" ? "COD" : "Stripe";

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided",
      });
    }

    // Build order items from live product data (never trust price from the client).
    // Each item may target a specific selling unit (e.g. Strip / Packet / Box);
    // price and stock are validated against that unit.
    const fullOrderItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with id ${item.product} not found`,
        });
      }

      let unitPrice;
      let unitStock;
      let unitLabel = null;

      if (Array.isArray(product.units) && product.units.length > 0) {
        const unit = item.unit
          ? product.units.find((u) => u.label === item.unit)
          : product.units.find((u) => u.isDefault) || product.units[0];

        if (!unit) {
          return res.status(400).json({
            success: false,
            message: `Selling unit "${item.unit}" is not available for ${product.name}`,
          });
        }

        unitPrice = unit.price;
        unitStock = unit.stock;
        unitLabel = unit.label;
      } else {
        unitPrice = product.price;
        unitStock = product.stock;
      }

      if (unitStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}${
            unitLabel ? ` (${unitLabel})` : ""
          }`,
        });
      }

      fullOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: unitPrice,
        quantity: item.quantity,
        unit: unitLabel,
      });

      itemsPrice += unitPrice * item.quantity;
    }

    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + shippingPrice;

    // Cash on Delivery: no online payment. Stock is reserved immediately and
    // the customer pays when the order arrives.
    if (method === "COD") {
      const order = await Order.create({
        user: req.user._id,
        orderItems: fullOrderItems,
        shippingAddress,
        paymentMethod: "COD",
        itemsPrice,
        shippingPrice,
        totalPrice,
        status: "Pending",
        isPaid: false,
      });

      await adjustUnitsStock(fullOrderItems, -1);

      try {
        await sendOrderConfirmationEmail(req.user, order);
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
      }

      return res.status(201).json({ success: true, order });
    }

    // Card flow: create a Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: "usd",
      metadata: { userId: req.user._id.toString() },
    });

    const order = await Order.create({
      user: req.user._id,
      orderItems: fullOrderItems,
      shippingAddress,
      paymentMethod: "Stripe",
      itemsPrice,
      shippingPrice,
      totalPrice,
      status: "Pending",
      isPaid: false,
      stripePaymentId: paymentIntent.id,
    });

    res.status(201).json({
      success: true,
      order,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm payment for an order
// @route   POST /api/orders/:id/pay
// @access  Private
const confirmPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order",
      });
    }

    // Retrieve the PaymentIntent from Stripe and verify it succeeded
    const paymentIntent = await stripe.paymentIntents.retrieve(
      order.stripePaymentId,
    );

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment has not been completed",
      });
    }

    // Mark the order as paid and move to Processing
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "Processing";

    // Decrement stock on each product (and its selling unit) in the order
    await adjustUnitsStock(order.orderItems, -1);

    await order.save();

    // Send confirmation email (don't fail the request if email sending fails)
    try {
      await sendOrderConfirmationEmail(req.user, order);
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (owner or admin)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "orderItems.product",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an order
// @route   DELETE /api/orders/:id
// @access  Private (owner)
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // The owner or an admin may cancel
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    // Set status to Cancelled instead of deleting, so order history is preserved
    order.status = "Cancelled";
    await order.save();

    // COD orders reserve stock at creation time — give it back on cancel
    if (order.paymentMethod === "COD" && !order.isPaid) {
      await adjustUnitsStock(order.orderItems, +1);
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark an order as completed/delivered (admin only).
//          Completed orders count as sales in the dashboard revenue chart
//          because they are marked paid with a paidAt timestamp.
// @route   PUT /api/orders/:id/complete
// @access  Private/Admin
const completeOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled orders cannot be completed",
      });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Order is already completed",
      });
    }

    order.status = "Delivered";

    // Record the sale: unpaid (COD) orders become paid on completion so they
    // appear in dashboard revenue stats and the sales chart.
    if (!order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  confirmPayment,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  completeOrder,
};
