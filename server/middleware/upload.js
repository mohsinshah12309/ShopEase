const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// NOTE: This Cloudinary account blocks SIGNED API-key uploads
// ("Request forbidden due to missing permissions (actions=[\"create\"])").
// Files are therefore uploaded via an UNSIGNED upload preset, which is
// permitted. Create/edit the preset at:
// Console -> Settings -> Upload -> Upload presets (signing mode: Unsigned)
const PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || "ecommerce_unsigned";
const FOLDER = process.env.CLOUDINARY_FOLDER || "ecommerce";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Step 1: buffer incoming files in memory and validate their type/size.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) return cb(null, true);
    const err = new Error("Only JPG, PNG, WEBP and GIF images are allowed");
    err.statusCode = 400;
    cb(err);
  },
});

// Step 2: stream every buffered file to Cloudinary using the unsigned
// preset, then attach the resulting URL onto the file object so
// controllers can keep reading file.path / file.secure_url.
function uploadToCloudinary(req, res, next) {
  const files = req.files || (req.file ? [req.file] : []);
  if (files.length === 0) return next();

  let pending = files.length;
  let settled = false;

  const done = (err) => {
    if (settled) return;
    if (err) {
      settled = true;
      return next(err);
    }
    if (--pending === 0) {
      settled = true;
      next();
    }
  };

  files.forEach((file) => {
    const stream = cloudinary.uploader.unsigned_upload_stream(
      PRESET,
      { folder: FOLDER },
      (error, result) => {
        if (error) return done(error);
        file.path = result.secure_url;
        file.secure_url = result.secure_url;
        file.filename = result.public_id;
        done();
      },
    );
    stream.end(file.buffer);
  });
}

module.exports = { upload, uploadToCloudinary };
