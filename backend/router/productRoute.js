import express from "express";
import multer from "multer";
import {Product} from "../models/product.model.js";
import mongoose from "mongoose";
import { createProduct, deleteProduct, getAllProducts, getproductById, getProducts ,updateProduct } from "../Controller/productController.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });


// ✅ CREATE PRODUCT (with image upload)

router.post("/create", upload.single("Image"),createProduct);



//✅ GET ALL PRODUCTS

router.get("/", getAllProducts );
router.get("/getproducts", getProducts); // get all products with filter and search query
router.get("/:id", getproductById); // get single product by Id 
router.put("/:id", updateProduct); // update Product by Id (dashboard)

// ✅ DELETE PRODUCT

router.delete("/:id", deleteProduct) // delete Product By Id (Dashboard)


export default router;
