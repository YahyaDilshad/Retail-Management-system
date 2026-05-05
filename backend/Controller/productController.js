import { uploadToCloudinary } from "../config/Cloudinary.js";
import { Product } from "../models/product.model.js";
import { createproduct } from "../services/product.service.js";
import {Order} from "../models/order.model.js";
import { Op, where } from "sequelize";
import { Brand } from "../models/brand.model.js";

export const createProduct = async (req, res)=>{
      try {
        const { Name, Price, brandName , Stock, Discount, Description } = req.body;
      // Validation
        if (!Name || !Price == null || !brandName ) {
          return res.status(400).json({
            success: false,
            message: "Missing required fields (name, price, brandId)",
          });
        }
        const existingProduct = await Product.findOne({
            where: { Name : Name }
          });

          if (existingProduct) {
            return res.status(409).json({
              message: "Product already exists"
            });
          }
        const fetchExistingBrand = await Brand.findOne({
          where : { brandName : brandName}  
         }) 
         console.log("FetchBrand Data" , fetchExistingBrand)
         if(!fetchExistingBrand) return res.status(309).send("Cannot Fetch brand")
        // Upload image if available
        let imageUrl = "";
          if (req.file) {
            try {
              const uploadRes = await uploadToCloudinary(req.file);
              imageUrl = uploadRes?.url || "";
            } catch (uploadErr) {
              return res.status(500).json({
                success: false,
                message: "Failed to upload image to Cloudinary",
                error: uploadErr.message,
              });
            }
        }
        const product = await createproduct({
          Name,
          Price,
          brandId : fetchExistingBrand.id,
          Stock,
          brandName : fetchExistingBrand.brandName, 
          Discount,
          Description,
          Image: imageUrl || "",
        });
       console.log("Product data send to service" , product)
       res.status(201).json({
       success: true,
       message: "Product created successfully",
       data: product
      });
      } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
          success: false,
          message: "Server error while creating product",
          error: error.message,
        });

    }
}
export const updateProduct = async (req,res)=>{
    try{
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({success : false , message : "Invalid ID Format"})
        }
        const updateProduct = await productModel.findByIdAndUpdate(id , req.body ,
            {new : true,
            runValidators : true
            }).populate("brand" , "name").populate("category" , "name")
        res.status(200).json({success : true , message : "Product Updated Successfully" , updateProduct})
        }catch(error){
            res.status(500).json({success : false , message : "Server Error while updating a  Product"})
        }

}    

export const deleteProduct =   async (req, res) => {
  try {
       const {id} = req.params;
    const deleted = await Product.destroy({
      where : {id : id}
    });
   
    if (!deleted) {
        console.log("Product Not Found For Deleting this Id (error in controller file)")
        return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    console.log("Product Deleted Successfully")
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// get all Product for user and admin both 
export const getAllProducts = async (req, res) => {
  try {
    const { category, brand, search } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (search) {
      filter[Op.or] = [
        { name: {[Op.like]: `%${search}%`}},
        { description: {[Op.like] : `%${search}%`} },
      ];
    }

    const products = await Product.findAll({ where: filter })

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
// get Products with Filters and search
export const getProducts = async (req,res)=>{
    try {
        const { categoryName, brandName, search } = req.query;
        let filter = {};
        if (category) filter.category = category;
        
        if(brand && Brand.findByPk(brand)){
          return res.status(400).json({
            success: false,
            message: "Invalid brand ID"
          });
        }
        if (brand) {
        const brandDoc = await brand.findById(brand);

        if (!brandDoc) {
          return res.status(400).json({
            success: false,
            message: "cannot match brand ID"
        });
        }

  filter.brand = brand;
}
      if (search) {
          filter.$or 
        }
         console.log("Applied Filter:", filter);
        
        const products = await productModel.find(filter)
          .populate("brand","name")
          .populate("category","name")
          .sort({ createdAt: -1 });
        res.json({ success: true, count: products.length, data: products });

      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Server error" });
      }
}

// if You get single Product this function call you  
export const getproductById = async (req,res)=>{
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, message: "Invalid ID format" });
        }
        
        const product = await productModel.findById(id)
          .populate("brand", "name")
          .populate("category", "name");
    
        if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }
    
        res.json({ success: true, data: product });
      } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ success: false, message: "Server error" });
      }
}
