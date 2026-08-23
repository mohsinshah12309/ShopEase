const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");

// Helper: parse and validate the "units" field sent from the admin form.
// Since products are created/updated via multipart/form-data (image upload),
// units arrives as a JSON string in req.body.units and must be parsed.
// Ensures exactly one unit is marked isDefault, and returns the derived
// top-level price (default unit's price) and stock (sum of all units).
function parseAndValidateUnits(rawUnits) {
  let units;
  try {
    units = typeof rawUnits === "string" ? JSON.parse(rawUnits) : rawUnits;
  } catch (err) {
    throw new Error("Invalid units format — must be valid JSON");
  }

  if (!Array.isArray(units) || units.length === 0) {
    throw new Error("At least one unit (e.g. Strip, Packet, Box) is required");
  }

  for (const unit of units) {
    if (!unit.label || typeof unit.label !== "string") {
      throw new Error("Each unit must have a label (e.g. 'Strip')");
    }
    if (unit.price == null || Number(unit.price) < 0) {
      throw new Error(`Unit "${unit.label}" must have a valid price >= 0`);
    }
    unit.price = Number(unit.price);
    unit.stock = unit.stock != null ? Number(unit.stock) : 0;
    if (unit.stock < 0) {
      throw new Error(`Unit "${unit.label}" stock cannot be negative`);
    }
  }

  // Ensure exactly one default unit — if none marked, default the first one
  const defaultCount = units.filter((u) => u.isDefault).length;
  if (defaultCount === 0) {
    units[0].isDefault = true;
  } else if (defaultCount > 1) {
    // keep only the first marked default, unset the rest
    let seenDefault = false;
    units.forEach((u) => {
      if (u.isDefault && seenDefault) {
        u.isDefault = false;
      } else if (u.isDefault) {
        seenDefault = true;
      }
    });
  }

  const defaultUnit = units.find((u) => u.isDefault);
  const derivedPrice = defaultUnit.price;
  const derivedStock = units.reduce((sum, u) => sum + u.stock, 0);

  return { units, derivedPrice, derivedStock };
}

// @desc    Get all products with filtering, search, sort, pagination
// @route   GET /products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, brand, search, sort, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        const categoryDoc = await Category.findOne({ slug: category });
        if (categoryDoc) filter.category = categoryDoc._id;
        else filter.category = null; // no matching category -> empty results
      }
    }

    if (brand) {
      filter.brand = brand;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    else if (sort === "price-desc") sortOption = { price: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };
    else if (sort === "top-rated") sortOption = { ratings: -1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .populate("category")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      products,
      page: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum),
      totalProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products for homepage
// @route   GET /products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .populate("category")
      .limit(8);

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product with reviews populated
// @route   GET /products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("reviews.user", "name");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product with Cloudinary images and units
// @route   POST /products
// @access  Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, brand, discountPrice, units } =
      req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    const images = req.files.map((file) => file.path || file.secure_url);

    let parsedUnits, derivedPrice, derivedStock;
    try {
      ({
        units: parsedUnits,
        derivedPrice,
        derivedStock,
      } = parseAndValidateUnits(units));
    } catch (validationError) {
      return res
        .status(400)
        .json({ success: false, message: validationError.message });
    }

    const product = await Product.create({
      name,
      description,
      category,
      brand,
      discountPrice: discountPrice || undefined,
      images,
      units: parsedUnits,
      price: derivedPrice,
      stock: derivedStock,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product details, images, or units
// @route   PUT /products/:id
// @access  Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const { name, description, category, brand, discountPrice, units } =
      req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (discountPrice !== undefined)
      product.discountPrice = discountPrice || undefined;

    if (units !== undefined) {
      try {
        const {
          units: parsedUnits,
          derivedPrice,
          derivedStock,
        } = parseAndValidateUnits(units);
        product.units = parsedUnits;
        product.price = derivedPrice;
        product.stock = derivedStock;
      } catch (validationError) {
        return res
          .status(400)
          .json({ success: false, message: validationError.message });
      }
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path || file.secure_url);
      product.images = [...product.images, ...newImages];
    }

    await product.save();

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /products/:id
// @access  Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review and rating (one per user per product)
// @route   POST /products/:id/review
// @access  Protected
const addReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.some(
      (r) => r.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const { rating, comment } = req.body;

    product.reviews.push({
      user: req.user._id,
      rating,
      comment,
      createdAt: new Date(),
    });

    product.numReviews = product.reviews.length;
    product.ratings =
      Math.round(
        (product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length) *
          10,
      ) / 10;

    await product.save();

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own review
// @route   DELETE /products/:id/review
// @access  Protected
const deleteReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    product.reviews = product.reviews.filter(
      (r) => r.user.toString() !== req.user._id.toString(),
    );

    product.numReviews = product.reviews.length;
    product.ratings =
      product.reviews.length > 0
        ? Math.round(
            (product.reviews.reduce((sum, r) => sum + r.rating, 0) /
              product.reviews.length) *
              10,
          ) / 10
        : 0;

    await product.save();

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  deleteReview,
};
