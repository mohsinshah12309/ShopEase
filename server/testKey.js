/**
 * Usage: node testKey.js <api_key> <api_secret> [folder]
 * Tests whether a specific Cloudinary key pair can UPLOAD (create).
 */
const cloudinary = require("cloudinary").v2;

const [, , apiKey, apiSecret, folder = "ecommerce"] = process.argv;
if (!apiKey || !apiSecret) {
  console.error("Usage: node testKey.js <api_key> <api_secret> [folder]");
  process.exit(1);
}

require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: apiKey,
  api_secret: apiSecret,
});

console.log(`Testing upload as KEY ${apiKey} into folder "${folder}"...`);
cloudinary.uploader.upload(
  "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  { folder },
  (error, result) => {
    if (error) {
      console.log(`KEY ${apiKey} -> FAIL:`, error.message);
    } else {
      console.log(`KEY ${apiKey} -> SUCCESS:`, result.secure_url);
    }
    process.exit(0);
  },
);
