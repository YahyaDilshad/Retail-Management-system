  import React, { useEffect, useState } from "react";
  import useProductStore from "../store/productauthstore";
  import { toast } from "react-toastify";
  import { Plus, BadgeCheck, FolderTree, Delete, Trash2, Edit, Loader } from "lucide-react";
  import {QueryCache, useMutation, useQueries, useQuery, useQueryClient} from "@tanstack/react-query"
  import Swal from 'sweetalert2';
  import axiosInstance from "../lib/axios";
  import { LoaderIcon } from "react-hot-toast";
  const ProductPage = () => {
    
    const [showProductForm, setShowProductForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showBrandForm, setShowBrandForm] = useState(false);
    const [searchItem, setSearchItem] = useState("");
    
    const queryClient  = useQueryClient()
    const CreateProductsResult = useMutation(
      {
          mutationFn : async (data) =>{ 
            console.log("create Data" , data)
          const res = await axiosInstance.post('/products/create' , data)
          },
          onSuccess : ()=>{
            queryClient.invalidateQueries('Products')
          }
      }
  )
    const createBrandResluts = useMutation(
      {
          mutationFn : async (brandPayload) =>{ 
            console.log('create Brand Data' , brandPayload.categoryName)
          const res = await axiosInstance.post('/brands/create' , brandPayload)
          
          },onSuccess :() =>{
            queryClient.invalidateQueries("brands")
          }
      }
  )
    const createCategoryResults = useMutation(
      {
        mutationFn : async(categoryPayload) =>{
          console.log(categoryPayload)
          const res = await axiosInstance.post("/categories/create" , categoryPayload)

        },
        onSuccess : ()=>{
          queryClient.invalidateQueries('categories')
        }
      }
    )
    const results = useQueries({
        queries :[
          {
            queryKey : ['Products'],
            queryFn : async()=>{
              const res = await axiosInstance.get('/products')
              
              return res.data

            }
          },
          {
            queryKey : ["categories"],
            queryFn : async()=>{
              const res = await axiosInstance.get('/categories')
              return res.data
            }
          },
          {
            queryKey : ["brands"],
            queryFn : async()=>{
              const res = await axiosInstance.get('/brands')
              return res.data
            }
          }
          // {
          //   queryKey: ["searchProducts" , searchItem], 
          //   queryFn : async()=>{
          //     const res = await axiosInstance.get(`/products/getproducts?search=${searchItem}`)
          //     return res.data
          //   }
          // }
          
        ]
    
      })
    

    const FetchProductsArray = results[0]?.data?.data || []
    const FetchCategoryArray = results[1]?.data || []
    const FetchBrandArray = results[2]?.data || []
     // nst FetchSearchProducts = results[3].data || []
  

  // --------------Delete Product ------------------

  const handleDelete = async (id) => {
    // Custom Confirmation Dialog
    Swal.fire({
      title: "Are you Sure you want to delete this product?",
      text: "Cannot get product after delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0e6d65",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Produst Delete",
      cancelButtonText: "cancel"
    }).then(async (result) => {
      // Agar user ne 'Haan' (Confirm) par click kiya
      if (result.isConfirmed) {
        try {
          const res = await axiosInstance.delete(`/products/${id}`)
        
          if (res) {
            queryClient.invalidateQueries(['Products'])
            // Success Custom Alert
            Swal.fire({
              title: "Deleted!",
              text: "Product delete ho gaya hai.",
              icon: "success",
              timer: 1500, // 1.5 seconds baad khud band ho jayega
              showConfirmButton: false
            });
          }
        } catch (error) {
          Swal.fire("Error!", "Something Went Wrong.", "error");
        }
      }
    });
  };

    // ---------- CATEGORY ----------
    const [categoryData, setCategoryData] = useState({ categoryName: "" });

    const validateCategoryForm = () => {
      if (!categoryData.categoryName.trim()) {
        toast.error("Category name is required");
        return false;
      }
      return true;
    };

    const handleCategory = async (e) => {
    e.preventDefault();
    if (!validateCategoryForm()) return;
    try {
      await createCategoryResults.mutateAsync({ categoryName: categoryData.categoryName.trim() });
      setCategoryData({ categoryName: "" });
      setShowCategoryForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding category");
    }
    };

    // ---------- BRAND ----------
    const [brandData, setBrandData] = useState({
      brandName: "",
      Image: null,
      categoryName: "",
    });

    const validateBrandForm = () => {
      if (!brandData.brandName.trim()) {
        toast.error("Brand name is required");
        return false;
      }
      if (!brandData.categoryName.trim()) {
        toast.error("Category must be selected");
        return false;
      }
      console.log('categoryName' , brandData.categoryName)
      return true;
    };
    
    const handleBrand = async (e) => {
      e.preventDefault();
      if (!validateBrandForm()) return;

    const brandPayload = new FormData()
      brandPayload.append('brandName' , brandData.brandName),
      brandPayload.append('categoryName' , brandData.categoryName)
      
      if(brandData.Image) {
        brandPayload.append("Image" , brandData.Image)
      }else{
        return toast.error("Please select an image"); // Image lazmi check karein
      }
      await createBrandResluts.mutateAsync(brandPayload);
      setBrandData({ brandName: "", Image: null, categoryName: "" });
      setShowBrandForm(false)
    };
    
    // ---------- PRODUCT ----------
    const [formData, setFormData] = useState({
      Name: "",
      Price: "",
      Stock: "",
      Discount : "",
      brandName: "",
      Description: "",
      Image: null,
    });

    const handleProductFile = (e) => {
      setFormData({ ...formData, Image: e.target.files[0] });
    };
    const handleProductChange = (e) => {
      const { name, value } = e.target; // Small letters use karein
      setFormData({ ...formData, [name]: value });
    };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    
    // Text fields append karein
    data.append('Name', formData.Name);
    data.append('Price', formData.Price);
    data.append('Stock', formData.Stock);
    data.append('Discount' , formData.Discount)
    data.append('brandName', formData.brandName);
    data.append('Description', formData.Description);

    if (formData.Image) {
      data.append('Image', formData.Image); 
    } else {
      return toast.error("Please select an image"); // Image lazmi check karein
    }

    try {
      // Sahi mutation function call karein
      await CreateProductsResult.mutateAsync(data); 
      toast.success("✅ Product added successfully!");
      
      // Form Reset
      setFormData({
        Name: "", Price: "", Stock: "", Category: "", Brand: "", Description: "", Image: null,Discount : ""
      });
      setShowProductForm(false);
    } catch (error) {
      console.error("Backend Error:", error.response?.data || error.message);
      toast.error("❌ Failed to add product");
    }
  };
    const isLoading = results.some(r => r.isLoading)
  if (isLoading) {
    return <LoaderIcon />;
  }
    // ---------- JSX ----------
    return (
      <div className="w-[80%] top-0 absolute left-64 h-screen">
      <header className="border-b border-[#72727293] bg-white w-full relative">
          <div className="px-6 mt-10 py-5 relative  z-999 flex items-center justify-between bg-white">
            <h1 className="font-bold text-4xl">All Products</h1>

            <div className="flex items-center gap-5">
              {/* Add Brand Icon */}
              <FolderTree
                onClick={() => setShowBrandForm((prev) => !prev)}
                className="text-[20px] p-[3%] cursor-pointer hover:bg-black transition-all duration-200 hover:text-white w-10 bg-gray-100 rounded-full h-10 text-gray-500"
              />

              {/* Add Category Icon */}
              <BadgeCheck
                onClick={() => setShowCategoryForm((prev) => !prev)}
                className="text-[20px] p-[3%] cursor-pointer hover:bg-black transition-all duration-200 hover:text-white w-10 bg-gray-100 rounded-full h-10 text-gray-500"
              />

              {/* Add Product Button */}
              <div
                onClick={() => setShowProductForm((prev) => !prev)}
                className="btn bg-[#0e6d65] py-2 px-5 flex items-center text-white rounded cursor-pointer gap-2"
              >
                <Plus />
                <button>Add Product</button>
              </div>
            </div>
          </div>

          {/* ---------- Add Product Form ---------- */}
          <div
            className={`absolute transition-all duration-300 ${
              showProductForm ? "top-17" : "top-[-300%]"
            } w-full p-5 rounded-xl bg-[#f8f6f6]`}
          >
            <h1 className="text-xl mb-3">Add New Product</h1>

            <form
              onSubmit={e => handleSubmitProduct(e)}
              className="py-5 w-full rounded flex items-center flex-wrap gap-2"
            >
              <input
                name="Name"
                placeholder="Product Name"
                value={formData.Name}
                onChange={e => handleProductChange(e)}
                className="border rounded outline-none border-[#cfcfcfda] p-2 w-50 mb-2"
              />
              <input
                name="Price"
                placeholder="Price"
                value={formData.Price}
                onChange={e => handleProductChange(e)}
                className="border rounded outline-none border-[#cfcfcfda] p-2 w-50 mb-2"
              />
              <input
                name="Discount"
                placeholder="Discount"
                value={formData.Discount}
                onChange={e => handleProductChange(e)}
                className="border rounded outline-none border-[#cfcfcfda] p-2 w-50 mb-2"
              />
              <input
                name="Stock"
                placeholder="Stock"
                value={formData.Stock}
                onChange={e => handleProductChange(e)}
                className="border rounded outline-none border-[#cfcfcfda] p-2 w-50 mb-2"
              />
              {/* Brand dropdown */}
              <select
                name="brandName"
                value={formData.brandName}
                onChange={e => handleProductChange(e)}
                className="border p-2 w-50 outline-none rounded border-[#cfcfcfda]"
              >
                <option value="">Select Brand</option>
                {FetchBrandArray.brands?.map((b, idx) => (
                  <option key={b.id ?? b.brandName ?? idx} value={b._id}>
                    {b.brandName}
                  </option>
                ))}
              </select>

              <input
                name="Description"
                placeholder="Description"
                value={formData.Description}
                onChange={e => handleProductChange(e)}
                className="border outline-none border-[#cfcfcfda] p-2 w-50 "
              />
              <div className="border p-1 overflow-hidden w-50 outline-none rounded border-[#cfcfcfda]">
              <input
                type="file"
                accept="image/*"
                onChange={e => handleProductFile(e)}
                className="mb-2"
              />
              </div>
              <button
                type="submit"
                className="cursor-pointer bg-gray-800 text-white px-4 py-2 rounded"
              >
                Add Product
              </button> 
            </form>
          </div>

          {/* ---------- Add Brand Form ---------- */}
          <div
            className={`absolute transition-all duration-300 ${
              showBrandForm ? "top-17" : "top-[-200%]"
            } w-full p-5 rounded-xl bg-[#f8f6f6]`}
          >
            <h1 className="text-xl mb-3">Add New Brand</h1>
            <form
              onSubmit={handleBrand}
              className="py-5 w-full rounded flex items-center flex-wrap gap-2"
            >
              <input
                name="name"
                placeholder="Brand Name"
                value={brandData.brandName}
                onChange={(e) =>
                  setBrandData({ ...brandData, brandName: e.target.value })
                }
                className="border rounded outline-none border-[#cfcfcfda] p-2 w-50 mb-2"
              />

              {/* Category dropdown */}
              <select
                name="categoryName"
                value={brandData.categoryName}
                onChange={(e) => setBrandData({...brandData, categoryName: e.target.value})}
                className="..."
              >
                <option value="">Select Category</option>
                {FetchCategoryArray.categories?.map((cat) => (
                  <option key={cat.id} value={cat.categoryName}>{cat.categoryName}</option>
                ))}
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setBrandData({ ...brandData, Image: e.target.files[0] })
                }
                className="mb-2"
              />
              <button
                type="submit"
                className="cursor-pointer bg-gray-800 text-white px-4 py-2 rounded"
              >
                Add Brand
              </button>
            </form>
          </div>

          {/* ---------- Add Category Form ---------- */}
          <div
            className={`absolute transition-all duration-300 ${
              showCategoryForm ? "top-17" : "top-[-200%]"
            } w-full p-5 rounded-xl bg-[#f8f6f6]`}
          >
            <h1 className="text-xl mb-3">Add New Category</h1>
            <form
              onSubmit={handleCategory}
              className="py-5 w-full rounded flex items-center flex-wrap gap-2"
            >
              <input
                name="categoryName"
                placeholder="Category Name"
                value={categoryData.categoryName}
                onChange={(e) =>
                  setCategoryData({ ...categoryData, categoryName: e.target.value })
                }
                className="border rounded outline-none border-[#cfcfcfda] p-2 w-50 mb-2"
              />
              <button
                type="submit"
                className="cursor-pointer bg-gray-800 text-white px-4 py-2 rounded"
              >
                Add Category
              </button>
            </form>
          </div>
        </header>

        {/* ---------- Search Bar ---------- */}
        <header className="border-b border-[#cfcfcfda] px-6 py-5 w-full flex items-center justify-between">
          <input
            type="text"
            value={searchItem}
            placeholder="Search product..."
            onChange={(e) => setSearchItem(e.target.value)}
            className="border outline-none border-[#cfcfcf] p-2 rounded w-[50%]"
          />
        </header>
      <div className="w-full  overflow-x-auto shadow-sm rounded-lg border border-gray-200">
    <table className="w-full text-left border-collapse bg-white">
      {/* Table Header */}
      <thead className="bg-gray-100 w-full border-b border-gray-300">
        <tr>
          <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
          <th className="px-4 py-3 font-semibold text-gray-700">Price</th>
          <th className="px-4 py-3 font-semibold text-gray-700">Discount</th>
          <th className="px-4 py-3 font-semibold text-gray-700">Description</th>
          <th className="px-4 py-3 font-semibold text-gray-700">Stock</th>
          <th className="px-4 py-3 font-semibold text-gray-700">Brand</th>
          <th className="px-4 py-3 font-semibold text-gray-700 text-right">Actions</th>
        </tr>
      </thead>

      {/* Table Body */}
      { FetchProductsArray.length > 0 ?
      (<tbody className="divide-y divide-gray-200">
        {FetchProductsArray?.map((p, idx) => (
          <tr key={idx} className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-4 text-sm text-gray-800 font-medium">{p.Name}</td>
            <td className="px-4 py-4 text-sm text-gray-600">{p.Price}</td>
            <td className="px-4 py-4 text-sm text-gray-600">{p.Discount}%</td>
            <td className="px-4 py-4 text-sm text-gray-600">{p.Description?.split(' ').slice(0, 4).join(' ') + "..."}</td>
            <td className="px-4 py-4 text-sm text-gray-600">{p.Stock}</td>
            <td className="px-4 py-4 text-sm text-gray-600">{p.brandName}</td>
            
            <td className="px-4 py-4 text-right">
              <div className="flex justify-end gap-3">
                <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-all">
                  <Edit className="w-4 h-4 text-gray-700" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-50 hover:bg-red-100 rounded-md transition-all">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>)
      :(<tbody>
        <tr>
          <td colSpan={7} className="text-center py-20">Products Not Found</td>
        </tr>
      </tbody>)}

          </table>

        </div>
        
      </div>
      
    );
  };

  export default ProductPage;
