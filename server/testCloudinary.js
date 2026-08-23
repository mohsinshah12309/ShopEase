require("dotenv").config();
const cloudinary = require("./config/cloudinary");

cloudinary.uploader.upload(
  "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  { folder: "ecommerce-test" },
  (error, result) => {
    if (error) {
      console.log("REAL CLOUDINARY ERROR:", error);
    } else {
      console.log("SUCCESS:", result.secure_url);
    }
  },
);
