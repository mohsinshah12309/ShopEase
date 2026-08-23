const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  // Multer errors (e.g. file too large, unexpected field)
  if (err.name === "MulterError") {
    const messages = {
      LIMIT_FILE_SIZE: "File too large",
      LIMIT_UNEXPECTED_FILE: "Unexpected file field",
    };
    return res.status(400).json({
      success: false,
      message: messages[err.code] || err.message,
    });
  }

  // Cloudinary errors surfaced through multer-storage-cloudinary.
  // e.g. 403 "Request forbidden due to missing permissions" when the
  // API key is restricted and lacks upload/create permission.
  if (err.http_code || err.name === "CloudinaryError") {
    return res
      .status(err.http_code >= 400 && err.http_code < 600 ? err.http_code : 500)
      .json({
        success: false,
        message: `Image upload failed: ${err.message}`,
      });
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res
      .status(400)
      .json({ success: false, message: messages.join(", ") });
  }

  // Mongoose invalid ObjectId
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = { notFound, errorHandler };
