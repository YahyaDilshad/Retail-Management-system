import React, { useState } from "react";
import { Store, Plus, Edit2, Trash2, MapPin, Search, X } from "lucide-react";
import { toast } from "react-toastify";

const StoreManagement = () => {
  // Demo Data for Frontend
  const [stores, setStores] = useState([
    { id: 1, name: "Apexiums Main Branch", location: "Gulberg, Lahore", status: "Active" },
    { id: 2, name: "Apexiums Mart", location: "DHA Phase 5, Karachi", status: "Inactive" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState({ id: null, name: "", location: "", status: "Active" });
  const [searchTerm, setSearchTerm] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    setCurrentStore({ ...currentStore, [e.target.name]: e.target.value });
  };

  // Open Modal for Add or Edit
  const openModal = (store = { id: null, name: "", location: "", status: "Active" }) => {
    setCurrentStore(store);
    setIsModalOpen(true);
  };

  // Add or Update Store
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentStore.name || !currentStore.location) {
      toast.error("Please fill all fields");
      return;
    }

    if (currentStore.id) {
      // Update logic
      setStores(stores.map((s) => (s.id === currentStore.id ? currentStore : s)));
      toast.success("Store updated successfully");
    } else {
      // Add logic
      const newStore = { ...currentStore, id: Date.now() };
      setStores([...stores, newStore]);
      toast.success("Store added successfully");
    }
    setIsModalOpen(false);
  };

  // Delete Store
  const deleteStore = (id) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      setStores(stores.filter((s) => s.id !== id));
      toast.info("Store deleted");
    }
  };

  // Filtered Stores for Search
  const filteredStores = stores.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-[90%] mt-14 ml-64">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#13786E]">Store Management</h1>
          <p className="text-gray-500">Manage all your retail outlets from here</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#13786E] hover:bg-[#0e5a52] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} /> Add New Store
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search stores by name..."
          className="w-full outline-none text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stores Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Store Details</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Location</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredStores.map((store) => (
              <tr key={store.id} className="hover:bg-teal-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 p-2 rounded-lg text-[#13786E]">
                      <Store size={20} />
                    </div>
                    <span className="font-medium text-gray-800">{store.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  {store.location}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    store.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {store.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openModal(store)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Store"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteStore(store.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Store"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStores.length === 0 && (
          <div className="p-10 text-center text-gray-400">No stores found.</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-[#13786E] p-6 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">{currentStore.id ? "Edit Store" : "Add New Store"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Store Name</label>
                <input
                  name="name"
                  type="text"
                  value={currentStore.name}
                  onChange={handleChange}
                  placeholder="e.g. Apexiums West"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#13786E] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input
                  name="location"
                  type="text"
                  value={currentStore.location}
                  onChange={handleChange}
                  placeholder="Street address or City"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#13786E] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={currentStore.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#13786E] outline-none bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#13786E] text-white rounded-xl font-semibold hover:bg-[#0e5a52] transition-colors"
                >
                  {currentStore.id ? "Update Store" : "Create Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManagement;