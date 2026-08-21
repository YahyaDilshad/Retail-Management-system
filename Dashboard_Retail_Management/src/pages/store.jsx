import React, { useState } from "react";
import { 
  Store, Plus, Edit2, Trash2, MapPin, Search, X, 
  User, Tag, Phone, Mail, DollarSign, Calendar 
} from "lucide-react";
import { toast } from "react-toastify";

const StoreManagement = () => {
  // Demo Data with new fields
  const [stores, setStores] = useState([
    { 
        id: 1, 
        name: "Apexiums Central", 
        owner: "Ali Ahmed",
        address: "Gulberg III, Lahore", 
        shopType: "Retail Mart",
        contact: "0300-1234567",
        email: "central@apex.com",
        monthlyRent: "55,000",
        createdAt: "2024-01-15",
        status: "Active" 
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Empty State for Form
  const emptyStore = { 
    id: null, 
    name: "", 
    owner: "", 
    address: "", 
    shopType: "", 
    contact: "", 
    email: "", 
    monthlyRent: "", 
    createdAt: new Date().toISOString().split('T')[0], // Default today
    status: "Active" 
  };

  const [currentStore, setCurrentStore] = useState(emptyStore);

  // Handle Input Change
  const handleChange = (e) => {
    setCurrentStore({ ...currentStore, [e.target.name]: e.target.value });
  };

  // Open Modal for Add or Edit
  const openModal = (store = emptyStore) => {
    setCurrentStore(store);
    setIsModalOpen(true);
  };

  // Add or Update Store
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentStore.name || !currentStore.owner || !currentStore.contact) {
      toast.error("Please fill required fields (Name, Owner, Contact)");
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
      toast.success("New store created successfully");
    }
    setIsModalOpen(false);
  };

  // Delete Store
  const deleteStore = (id) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      setStores(stores.filter((s) => s.id !== id));
      toast.info("Store removed from list");
    }
  };

  // Filtered Stores for Search
  const filteredStores = stores.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen mt-14 ml-64">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#13786E]">Store Management</h1>
          <p className="text-gray-500">Manage owner details, rent, and store information</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#13786E] hover:bg-[#0e5a52] text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95 font-bold"
        >
          <Plus size={20} /> Create New Store
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search stores by name or owner..."
          className="w-full outline-none text-gray-700 bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stores Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Store & Owner</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Type & Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Monthly Rent</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Created At</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-teal-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{store.name}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1"><User size={12}/> {store.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-700 font-medium">{store.shopType}</p>
                      <p className="text-xs text-gray-500">{store.contact}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-[#13786E]">Rs. {store.monthlyRent}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {store.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openModal(store)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => deleteStore(store.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStores.length === 0 && (
          <div className="p-10 text-center text-gray-400 italic">No store data available.</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#13786E] p-6 flex justify-between items-center text-white">
              <div>
                <h2 className="text-xl font-bold">{currentStore.id ? "Edit Store Details" : "Add New Store"}</h2>
                <p className="text-teal-100 text-xs">Fill in all fields to register the store</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 h-100 overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Store Name */}
                <FormInput label="Store Name" name="name" icon={<Store size={16}/>} value={currentStore.name} onChange={handleChange} placeholder="e.g. Apexiums Mart" />
                
                {/* Owner Name */}
                <FormInput label="Owner Name" name="owner" icon={<User size={16}/>} value={currentStore.owner} onChange={handleChange} placeholder="Owner Full Name" />
                
                {/* Address */}
                <div className="md:col-span-2">
                  <FormInput label="Full Address" name="address" icon={<MapPin size={16}/>} value={currentStore.address} onChange={handleChange} placeholder="Shop address, Street, City..." />
                </div>

                {/* Shop Type */}
                <FormInput label="Shop Type" name="shopType" icon={<Tag size={16}/>} value={currentStore.shopType} onChange={handleChange} placeholder="e.g. Pharmacy, Grocery, Electronics" />

                {/* Contact */}
                <FormInput label="Contact Number" name="contact" icon={<Phone size={16}/>} value={currentStore.contact} onChange={handleChange} placeholder="03xx-xxxxxxx" />

                {/* Email */}
                <FormInput label="Email Address" name="email" type="email" icon={<Mail size={16}/>} value={currentStore.email} onChange={handleChange} placeholder="store@example.com" />

                {/* Monthly Rent */}
                <FormInput label="Monthly Rent (Rs)" name="monthlyRent" type="number" icon={<DollarSign size={16}/>} value={currentStore.monthlyRent} onChange={handleChange} placeholder="Amount in PKR" />

                {/* Date of Creation */}
                <FormInput label="Creation Date" name="createdAt" type="date" icon={<Calendar size={16}/>} value={currentStore.createdAt} onChange={handleChange} />
              </div>

              <div className="pt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#13786E] text-white rounded-xl font-bold hover:bg-[#0e5a52] shadow-lg shadow-teal-900/20"
                >
                  {currentStore.id ? "Update Store" : "Confirm & Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Input Component
const FormInput = ({ label, icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
      <span className="text-[#13786E]">{icon}</span> {label}
    </label>
    <input
      {...props}
      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#13786E] focus:border-transparent outline-none transition-all bg-gray-50/50"
    />
  </div>
);

export default StoreManagement;