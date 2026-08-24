import React, { useState } from "react";
import { 
  Plus, Trash2, Edit, Loader, Search, 
  Package, Tag, Bookmark, X, DollarSign,
  Calendar, Truck, Layers, Hash, Barcode, Printer, ArrowRight
} from "lucide-react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const ProductPage = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const queryClient = useQueryClient();

  // 1. Fetching Data
  const results = useQueries({
    queries: [
      { queryKey: ['Products'], queryFn: async () => (await axiosInstance.get('/products/all')).data },
      { queryKey: ['categories'], queryFn: async () => (await axiosInstance.get('/categories/all')).data }, 
      { queryKey: ['brands'], queryFn: async () => (await axiosInstance.get('/brands/all')).data } 
    ]
  });

  const products = results[0]?.data || [];
  const categoriesList = results[1]?.data || [];
  const brandsList = results[2]?.data || [];
  const isLoading = results[0].isLoading;

  const [productForm, setProductForm] = useState({ 
    productName: "", category: "", costPrice: "", brand: "", 
    sellingPrice: "", stock: "", expiryDate: "", dealer: "" 
  });

  const resetForm = () => {
    setProductForm({ productName: "", category: "", costPrice: "", brand: "", sellingPrice: "", stock: "", expiryDate: "", dealer: "" });
  };

  const createProduct = useMutation({
    mutationFn: (data) => axiosInstance.post('/products/add', data),
    onSuccess: () => { 
      queryClient.invalidateQueries(['Products']); 
      toast.success("Product Added!"); 
      setActiveForm(null); 
      resetForm(); 
    }
  });

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if(!productForm.productName || !productForm.sellingPrice) return toast.error("Required fields missing");
    createProduct.mutate(productForm);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await axiosInstance.delete(`/products/delete/${id}`);
        queryClient.invalidateQueries(['Products']);
        toast.info("Product removed");
      } catch (err) { toast.error("Delete failed"); }
    }
  };

  const filteredProducts = products.filter(p => 
    p.productName?.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <div className="flex-1 ml-64 min-h-screen bg-[#F8FAFC] p-8 mt-14 text-left font-sans text-gray-800">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Inventory Assets</h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase">Manage & Categorize Stock Items</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Quick Search..." 
              value={searchItem} onChange={(e) => setSearchItem(e.target.value)} 
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none w-64 shadow-sm focus:ring-2 focus:ring-[#13786E] text-sm" 
            />
          </div>
          
          <button 
            onClick={() => { resetForm(); setActiveForm(activeForm === 'product' ? null : 'product'); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#13786E] text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
          >
            {activeForm === 'product' ? <X size={18}/> : <Plus size={18}/>}
            {activeForm === 'product' ? "Cancel" : "Add New Product"}
          </button>
        </div>
      </div>

      {/* FORM SECTION (Form Bottom Updated) */}
      {activeForm === 'product' && (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl p-8 mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleProductSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormInput label="Product Name" icon={<Package size={14}/>} value={productForm.productName} onChange={(e)=>setProductForm({...productForm, productName: e.target.value})} />
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Layers size={14} className="text-[#13786E]"/> Category</label>
                <select className="bg-gray-50 border border-gray-200 p-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700" value={productForm.category} onChange={(e)=>setProductForm({...productForm, category: e.target.value})}>
                  <option value="">Select Category</option>
                  {categoriesList.map((cat, i) => <option key={i} value={cat.categoryName || cat.name}>{cat.categoryName || cat.name}</option>)}
                </select>
              </div>
              <FormInput label="Cost of Occur" type="number" icon={<DollarSign size={14}/>} value={productForm.costPrice} onChange={(e)=>setProductForm({...productForm, costPrice: e.target.value})} />
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Bookmark size={14} className="text-[#13786E]"/> Brand</label>
                <select className="bg-gray-50 border border-gray-200 p-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700" value={productForm.brand} onChange={(e)=>setProductForm({...productForm, brand: e.target.value})}>
                  <option value="">Select Brand</option>
                  {brandsList.map((brand, i) => <option key={i} value={brand.brandName || brand.name}>{brand.brandName || brand.name}</option>)}
                </select>
              </div>
              <FormInput label="Selling Price" type="number" icon={<DollarSign size={14}/>} value={productForm.sellingPrice} onChange={(e)=>setProductForm({...productForm, sellingPrice: e.target.value})} />
              <FormInput label="Stock" type="number" icon={<Hash size={14}/>} value={productForm.stock} onChange={(e)=>setProductForm({...productForm, stock: e.target.value})} />
              <FormInput label="Product Expiry" type="date" icon={<Calendar size={14}/>} value={productForm.expiryDate} onChange={(e)=>setProductForm({...productForm, expiryDate: e.target.value})} />
              <FormInput label="Dealer" icon={<Truck size={14}/>} value={productForm.dealer} onChange={(e)=>setProductForm({...productForm, dealer: e.target.value})} />
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-50">
               <button type="submit" disabled={createProduct.isPending} className="px-12 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl">
                  {createProduct.isPending ? "Saving..." : "Save Product Data"}
               </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE SECTION */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-md overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-medium">
            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Product / Category</th>
                <th className="px-8 py-5 text-center">Stock Status</th>
                <th className="px-8 py-5">Cost vs Sell</th>
                <th className="px-8 py-5">Dealer / Brand</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                 <tr><td colSpan={5} className="py-20 text-center text-gray-300 font-black text-xs uppercase tracking-widest italic">Inventory is empty</td></tr>
              ) : filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-teal-50/40 transition-colors group">
                  <td className="px-8 py-5">
                    <div>
                      <p className="font-black text-gray-800 text-sm tracking-tight">{p.productName}</p>
                      <p className="text-[9px] text-teal-600 font-black uppercase">{p.category}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${p.stock > 5 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                      {p.stock} Units
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-red-300 font-bold tracking-tighter">COST: {p.costPrice}</span>
                        <span className="font-black text-[#13786E]">SELL: {p.sellingPrice}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-gray-500">{p.brand || "Generic"}</p>
                    <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest">{p.dealer || "Unknown"}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- UPDATED: PRINT BARCODE SECTION AT PAGE BOTTOM --- */}
      <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-6">
        <Barcode size={220} className="absolute -right-10 -bottom-10 opacity-10 rotate-12 text-white" />
        
        <div className="relative z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <div className="bg-teal-500 p-2.5 rounded-2xl shadow-lg shadow-teal-500/20"><Barcode size={22} /></div>
            <h2 className="text-lg font-black uppercase tracking-[4px] text-teal-400">Barcode Engine</h2>
          </div>
          <h3 className="text-3xl font-light leading-tight">Need unique tags for new stock? <br/> <span className="font-black text-white">Generate high-quality barcodes instantly.</span></h3>
          <p className="text-gray-400 mt-4 text-xs font-bold uppercase tracking-widest opacity-60">Standard EAN-13 / QR Compatibility</p>
        </div>

        <button 
          onClick={() => window.print()}
          className="mt-8 md:mt-0 bg-[#13786E] text-white px-12 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:bg-teal-600 transition-all shadow-2xl active:scale-95 group relative z-10 border border-teal-500/30"
        >
          <Printer size={20} className="group-hover:rotate-12 transition-transform" /> 
          Launch Printer System 
          <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>

    </div>
  );
};

const FormInput = ({ label, icon, ...props }) => (
  <div className="flex flex-col gap-2 text-left">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
      <span className="text-[#13786E]">{icon}</span> {label}
    </label>
    <input 
      {...props} 
      className="bg-gray-50 border border-gray-200 p-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700 transition-all" 
    />
  </div>
);

export default ProductPage;