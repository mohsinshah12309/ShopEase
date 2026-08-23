const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmationEmail = async (user, order) => {
  try {
    const itemsHtml = order.orderItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
        </tr>
      `,
      )
      .join("");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Confirmation</h2>
        <p>Dear ${user.name},</p>
        <p>Thank you for your order! Your order has been received and is being processed.</p>

        <h3>Order Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 8px; border-bottom: 2px solid #333; text-align: left;">Item</th>
              <th style="padding: 8px; border-bottom: 2px solid #333; text-align: center;">Quantity</th>
              <th style="padding: 8px; border-bottom: 2px solid #333; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p style="margin-top: 20px; font-size: 18px; font-weight: bold;">
          Total: $${order.totalPrice.toFixed(2)}
        </p>

        <h3>Shipping Address</h3>
        <p>
          ${order.shippingAddress.street}<br />
          ${order.shippingAddress.city}, ${order.shippingAddress.province} ${order.shippingAddress.postalCode}<br />
          ${order.shippingAddress.country}
        </p>

        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          If you have any questions about your order, please contact our support team.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Order Confirmation - #${order._id}`,
      html,
    });
  } catch (error) {
    throw error;
  }
};

module.exports = { sendOrderConfirmationEmail };
