import React, { useState } from "react";
import { 
  Plus, Trash2, Edit, Loader, Search, 
  Package, Tag, Bookmark, X, Image as ImageIcon,
  AlertCircle, CheckCircle2, Upload
} from "lucide-react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import Swal from 'sweetalert2';
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const ProductPage = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const queryClient = useQueryClient();

  // Queries - Fetching all data
  const results = useQueries({
    queries: [
      { queryKey: ['Products'], queryFn: async () => (await axiosInstance.get('/products')).data },
      { queryKey: ['categories'], queryFn: async () => (await axiosInstance.get('/categories')).data },
      { queryKey: ['brands'], queryFn: async () => (await axiosInstance.get('/brands')).data }
    ]
  });

  // Safe Data Extraction
  const products = results[0]?.data?.data || results[0]?.data?.products || [];
  
  const categoriesList = results[1]?.data?.categories || 
                         results[1]?.data?.data || 
                         (Array.isArray(results[1]?.data) ? results[1]?.data : []);

  const brandsList = results[2]?.data?.brands || 
                     results[2]?.data?.data || 
                     (Array.isArray(results[2]?.data) ? results[2]?.data : []);

  const isLoading = results.some(r => r.isLoading);

  // Mutations
  const createProduct = useMutation({
    mutationFn: (data) => axiosInstance.post('/products/create', data),
    onSuccess: () => { queryClient.invalidateQueries(['Products']); toast.success("Product Added!"); setActiveForm(null); resetForms(); }
  });

  const createCategory = useMutation({
    mutationFn: (data) => axiosInstance.post('/categories/create', data),
    onSuccess: () => { queryClient.invalidateQueries(['categories']); toast.success("Category Added!"); setActiveForm(null); resetForms(); }
  });

  const createBrand = useMutation({
    mutationFn: (data) => axiosInstance.post('/brands/create', data),
    onSuccess: () => { queryClient.invalidateQueries(['brands']); toast.success("Brand Added!"); setActiveForm(null); resetForms(); }
  });

  // States
  const [productForm, setProductForm] = useState({ Name: "", Price: "", Stock: "", Discount: "", brandName: "", Description: "", Image: null });
  const [catForm, setCatForm] = useState({ categoryName: "" });
  const [brandForm, setBrandForm] = useState({ brandName: "", categoryName: "", Image: null });

  const resetForms = () => {
    setProductForm({ Name: "", Price: "", Stock: "", Discount: "", brandName: "", Description: "", Image: null });
    setCatForm({ categoryName: "" });
    setBrandForm({ brandName: "", categoryName: "", Image: null });
  };

  // Handlers
  const handleProductSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(productForm).forEach(key => data.append(key, productForm[key]));
    createProduct.mutate(data);
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if(!catForm.categoryName) return toast.error("Category name is required");
    createCategory.mutate(catForm);
  };

  const handleBrandSubmit = (e) => {
    e.preventDefault();
    if(!brandForm.brandName || !brandForm.categoryName) return toast.error("Fill all brand fields");
    const data = new FormData();
    data.append("brandName", brandForm.brandName);
    data.append("categoryName", brandForm.categoryName);
    if(brandForm.Image) data.append("Image", brandForm.Image);
    createBrand.mutate(data);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#13786E",
      confirmButtonText: "Yes, delete"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/products/${id}`);
          queryClient.invalidateQueries(['Products']);
          Swal.fire("Deleted!", "", "success");
        } catch (error) { toast.error("Delete failed"); }
      }
    });
  };

  const filteredProducts = products.filter(p => p.Name?.toLowerCase().includes(searchItem.toLowerCase()));

  return (
    <div className="flex-1 ml-64 min-h-[90%] mt-14 bg-[#F8FAFC] p-8">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Inventory Management</h1>
          <p className="text-gray-500">Manage Products, Brands, and Categories</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search..." value={searchItem} onChange={(e) => setSearchItem(e.target.value)} className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl outline-none w-64 shadow-sm focus:ring-2 focus:ring-[#13786E] transition-all" />
          </div>
          
          <button onClick={() => setActiveForm('brand')} className={`p-2.5 rounded-xl border transition-all ${activeForm === 'brand' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`} title="Add Brand"><Bookmark size={20}/></button>
          <button onClick={() => setActiveForm('category')} className={`p-2.5 rounded-xl border transition-all ${activeForm === 'category' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`} title="Add Category"><Tag size={20}/></button>
          <button onClick={() => setActiveForm('product')} className="flex items-center gap-2 px-6 py-2.5 bg-[#13786E] text-white rounded-xl font-bold hover:bg-[#0e5e56] shadow-lg shadow-teal-900/10 transition-all">
            <Plus size={20} /> Add Product
          </button>
        </div>
      </div>

      {/* Forms Section */}
      {activeForm && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 mb-8 animate-in fade-in slide-in-from-top-4 duration-300 relative">
          <button onClick={() => setActiveForm(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"><X size={24}/></button>
          
          {/* 1. BRAND FORM */}
          {activeForm === 'brand' && (
            <form onSubmit={handleBrandSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Bookmark className="text-[#13786E]"/> Add New Brand</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField label="Brand Name" placeholder="e.g. Samsung" value={brandForm.brandName} onChange={(e)=>setBrandForm({...brandForm, brandName: e.target.value})} />
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-600">Assign Category</label>
                  <select className="border border-gray-200 p-2.5 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#13786E] text-sm" value={brandForm.categoryName} onChange={(e)=>setBrandForm({...brandForm, categoryName: e.target.value})}>
                    <option value="">Select Category</option>
                    {categoriesList.map((cat, i) => <option key={i} value={cat.categoryName}>{cat.categoryName}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                   <label className="text-sm font-medium text-gray-600">Brand Logo</label>
                   <label className="flex items-center justify-center gap-2 border border-dashed border-teal-200 bg-teal-50/30 p-2.5 rounded-lg cursor-pointer hover:bg-teal-50 transition-all">
                      <Upload size={16} className="text-teal-600" />
                      <span className="text-xs text-teal-700 font-semibold truncate">{brandForm.Image ? brandForm.Image.name : "Upload Logo"}</span>
                      <input type="file" className="hidden" onChange={(e)=>setBrandForm({...brandForm, Image: e.target.files[0]})} />
                   </label>
                </div>
              </div>
              <div className="flex justify-end"><button type="submit" className="px-8 py-2 bg-[#13786E] text-white rounded-xl font-bold shadow-md">Save Brand</button></div>
            </form>
          )}

          {/* 2. CATEGORY FORM */}
          {activeForm === 'category' && (
            <form onSubmit={handleCategorySubmit} className="max-w-md space-y-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Tag className="text-[#13786E]"/> Add New Category</h2>
              <div className="flex gap-2">
                <input className="flex-1 border border-gray-200 p-2.5 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#13786E]" placeholder="Category Name..." value={catForm.categoryName} onChange={(e)=>setCatForm({categoryName: e.target.value})} />
                <button type="submit" className="bg-[#13786E] text-white px-6 rounded-xl font-bold shadow-md">Add</button>
              </div>
            </form>
          )}

          {/* 3. PRODUCT FORM */}
          {activeForm === 'product' && (
            <form onSubmit={handleProductSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Package className="text-[#13786E]"/> New Product Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField label="Product Name" value={productForm.Name} onChange={(e)=>setProductForm({...productForm, Name: e.target.value})} />
                <InputField label="Price" type="number" value={productForm.Price} onChange={(e)=>setProductForm({...productForm, Price: e.target.value})} />
                <InputField label="Stock" type="number" value={productForm.Stock} onChange={(e)=>setProductForm({...productForm, Stock: e.target.value})} />
                <InputField label="Discount (%)" type="number" value={productForm.Discount} onChange={(e)=>setProductForm({...productForm, Discount: e.target.value})} />
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-600">Select Brand</label>
                  <select className="border border-gray-200 p-2.5 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#13786E] text-sm cursor-pointer" value={productForm.brandName} onChange={(e)=>setProductForm({...productForm, brandName: e.target.value})}>
                    <option value="">{results[2].isLoading ? "Loading brands..." : "Choose a brand"}</option>
                    {brandsList.map((b, i) => (
                      <option key={b._id || b.id || i} value={b.brandName}>
                        {b.brandName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-600">Product Image</label>
                  <label className="cursor-pointer border border-dashed border-teal-200 bg-teal-50/30 rounded-lg p-2 text-center hover:bg-teal-50 transition-all flex items-center justify-center gap-2">
                    <Upload size={16} className="text-teal-600" />
                    <span className="text-xs text-teal-700 font-medium truncate max-w-[120px]">{productForm.Image ? productForm.Image.name : "Upload Image"}</span>
                    <input type="file" className="hidden" onChange={(e)=>setProductForm({...productForm, Image: e.target.files[0]})} />
                  </label>
                </div>
              </div>
              <textarea className="w-full border border-gray-200 p-2.5 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#13786E] h-20 text-sm" placeholder="Write description..." value={productForm.Description} onChange={(e)=>setProductForm({...productForm, Description: e.target.value})}></textarea>
              <div className="flex justify-end"><button type="submit" disabled={createProduct.isPending} className="px-8 py-2.5 bg-[#13786E] text-white rounded-xl font-bold shadow-lg transition-all">{createProduct.isPending ? "Saving..." : "Save Product"}</button></div>
            </form>
          )}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase text-gray-500">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
               <tr><td colSpan={6} className="py-20 text-center text-gray-400">Loading Inventory...</td></tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p, idx) => (
                <tr key={idx} className="hover:bg-teal-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                        {p.Image ? <img src={p.Image} alt="" className="w-full h-full object-cover"/> : <ImageIcon className="text-gray-300" size={18}/>}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{p.Name}</p>
                        <p className="text-[10px] text-gray-400 truncate w-32">{p.Description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{p.brandName || "N/A"}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800 text-sm">${p.Price}</p>
                    {p.Discount > 0 && <p className="text-[10px] text-emerald-500 font-bold">-{p.Discount}%</p>}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">{p.Stock}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full w-fit ${p.Stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {p.Stock > 10 ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
                      {p.Stock > 10 ? 'In Stock' : 'Low Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200 text-gray-500"><Edit size={14}/></button>
                      <button onClick={()=>handleDelete(p._id || p.id)} className="p-1.5 hover:bg-red-50 rounded border border-transparent hover:border-red-100 text-red-500"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="py-20 text-center text-gray-400 italic">No inventory found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <input {...props} className="border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50 text-sm transition-all" />
  </div>
);

export default ProductPage;