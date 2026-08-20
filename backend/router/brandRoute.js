
import express from "express";
import multer from "multer";
import {Product} from "../models/product.model.js";
import { uploadToCloudinary } from "../config/Cloudinary.js";
import { Brand } from "../models/brand.model.js";
import { Category } from "../models/Category.model.js";


const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// 🔹 CREATE BRAND
router.post("/create", upload.single("Image"), async (req, res) => {
  try {
    const { brandName, categoryName } = req.body;

    // Validate
    if (!brandName?.trim() || !categoryName) {
      return res.status(400).json({ success: false, message: "brandName and categoryName are required" });
    }

    // Check duplicate
    const existingBrand = await Brand.findOne({ brandName: brandName.trim() });
    if (existingBrand) {
      return res.status(400).json({ success: false, message: "Brand already exists" });
    }

    let url =  "";
    if (req.file) {
      try {
        const uploadRes = await uploadToCloudinary(req.file);
        url = uploadRes?.url || "";
      } catch (err) {
        console.error("Cloudinary brand upload error:", err);
        return res.status(500).json({ success: false, message: "Failed to upload brand image" });
      }
    }
    // Valid Category check
    const fetchCategory = await Category.findOne({ categoryName: categoryName.trim() });
    if (!fetchCategory) {
      return res.status(404).json({ success: false, message: `Category ID ${categoryName} not found.` });
    }

    const brand = await Brand.create({
      brandName: brandName.trim(),
      Image: url, // Capital 'I' jaisa model mein hai
      categoryId: fetchCategory._id,
      categoryName : fetchCategory.categoryName

    });
    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      brand,
    });
  } catch (err) {
    console.error("Error creating brand:", err);
    res.status(500).json({
      success: false,
      message: "Server error while creating brand",
      error: err.message,
    });
  }
});

// 🔹 GET ALL BRANDS
router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    if(!brands.length) return res.status(404).send("total brands fetched success" + [])
    res.status(200).json({
      success: true,
      count: brands.length,
      brands,
    });

  } catch (error) {
    console.log("Error fetching brands:", error);
    res.status(500).json({ success: false, message: "Failed to fetch brands" , error : error.message });
  }
});

// // 🔹 GET ALL PRODUCTS OF A SPECIFIC BRAND
// router.get("/:brandId/product", async (req, res) => {
//   try {
//     const { brandId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(brandId)) {
//       return res.status(400).json({ success: false, message: "Invalid brand ID" });
//     }

//     const products = await Product.find({ brand: brandId })
//       .populate("brand", "name")
//       .populate("category", "name");

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       products,
//     });
//   } catch (error) {
//     console.error("Error fetching brand products:", error);
//     res.status(500).json({ success: false, message: "Server error while fetching products" });
//   }
// });

export default router;
