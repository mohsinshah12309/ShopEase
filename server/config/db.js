const mongoose = require("mongoose");

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1 || isConnecting) return;

  try {
    isConnecting = true;
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Retry connection after 5 seconds instead of crashing the process
    setTimeout(connectDB, 5000);
  } finally {
    isConnecting = false;
  }
};

module.exports = connectDB;
