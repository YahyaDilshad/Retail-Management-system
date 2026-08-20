import React, { useState } from "react";
import { 
  Search, Plus, Edit, Trash2, 
  Layers, X, FolderOpen, MoreHorizontal,
  CheckCircle2, Calendar
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";

const Categories = () => {
  const [searchItem, setSearchItem] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const queryClient = useQueryClient();

  // 1. Fetch Categories
  const { data: rawData, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosInstance.get('/categories');
      return res.data;
    }
  });

  // Data format safe handling
  const categoriesArray = Array.isArray(rawData) 
    ? rawData 
    : (rawData?.categories || rawData?.data || []);

  // 2. Create Category Mutation
  const createMutation = useMutation({
    mutationFn: (categoryName) => axiosInstance.post('/categories/create', { categoryName }),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success("Category added successfully!");
      setNewCategory("");
      setShowAddForm(false);
    }
  });

  // 3. Delete Category
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      Swal.fire("Deleted!", "Category removed.", "success");
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Products in this category might be affected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#13786E",
      confirmButtonText: "Yes, delete it"
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const filteredCategories = categoriesArray.filter(cat => 
    cat?.categoryName?.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <div className="flex-1 ml-64 min-h-screen bg-[#F8FAFC] p-8">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Layers className="text-[#13786E]" /> Categories
          </h1>
          <p className="text-gray-500">Manage your product classifications</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search category..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#13786E] w-64 shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#13786E] text-white rounded-xl font-bold hover:bg-[#0e5e56] shadow-lg shadow-teal-900/10 transition-all"
          >
            {showAddForm ? <X size={20}/> : <Plus size={20}/>}
            {showAddForm ? "Close" : "Add Category"}
          </button>
        </div>
      </div>

      {/* Add Category Form (In-line) */}
      {showAddForm && (
        <div className="bg-white border border-teal-100 rounded-2xl p-6 mb-8 shadow-sm animate-in fade-in slide-in-from-top-4">
          <form onSubmit={(e) => { e.preventDefault(); if(newCategory) createMutation.mutate(newCategory); }} className="flex gap-4 items-end max-w-2xl">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-600 block mb-2">Category Name</label>
              <input 
                type="text" 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Beverages, Electronics..."
                className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#13786E]"
              />
            </div>
            <button 
              type="submit"
              disabled={createMutation.isPending}
              className="px-8 py-3 bg-[#13786E] text-white rounded-xl font-bold hover:bg-[#0e5e56] disabled:opacity-50 h-[52px]"
            >
              {createMutation.isPending ? "Saving..." : "Save Category"}
            </button>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-8 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider">Category Name</th>
              <th className="px-8 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider">Type</th>
              <th className="px-8 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider">Status</th>
              <th className="px-8 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                   <div className="flex justify-center items-center gap-2 text-gray-400">
                      <div className="w-5 h-5 border-2 border-[#13786E] border-t-transparent rounded-full animate-spin"></div>
                      Loading data...
                   </div>
                </td>
              </tr>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((cat, idx) => (
                <tr key={cat._id || cat.id || idx} className="hover:bg-teal-50/30 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-50 rounded-lg text-[#13786E]">
                        <FolderOpen size={18} />
                      </div>
                      <span className="font-bold text-gray-800">{cat.categoryName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <Layers size={14} /> Retail Standard
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit uppercase">
                      <CheckCircle2 size={12} /> Active
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-600 shadow-sm transition-all">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat._id || cat.id)}
                        className="p-2 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 text-red-500 shadow-sm transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-20 text-center text-gray-400 italic">
                  No categories found. Start by adding a new one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;