/**
 * Tests UNSIGNED upload via upload preset (bypasses API-key permissions).
 * Usage: node testUnsigned.js [presetName]
 */
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const preset = process.argv[2] || "ml_default";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

console.log(`Trying UNSIGNED upload with preset "${preset}"...`);
cloudinary.uploader.unsigned_upload(
  "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  preset,
  (error, result) => {
    if (error) {
      console.log("UNSIGNED FAIL:", error.message);
    } else {
      console.log("UNSIGNED SUCCESS:", result.secure_url);
    }
    process.exit(0);
  },
);
