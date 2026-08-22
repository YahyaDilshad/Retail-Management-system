import React, { useState, useEffect } from "react"; // useEffect add kiya
import { 
  Store, Plus, Edit2, Trash2, MapPin, Search, X, 
  User, Tag, Phone, Mail, DollarSign, Calendar 
} from "lucide-react";
import { toast } from "react-toastify";

const StoreManagement = () => {
  // --- 1. LOCAL STORAGE LOGIC ---
  // Initial state load karne ka tareeka: Check if data exists in localStorage
  const [stores, setStores] = useState(() => {
    const savedStores = localStorage.getItem("apex_stores_list");
    return savedStores ? JSON.parse(savedStores) : [
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
      }
    ];
  });

  // Jab bhi 'stores' change hon, unhe localStorage mein save karo
  useEffect(() => {
    localStorage.setItem("apex_stores_list", JSON.stringify(stores));
  }, [stores]);
  // ------------------------------

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const emptyStore = { 
    id: null, name: "", owner: "", address: "", shopType: "", 
    contact: "", email: "", monthlyRent: "", 
    createdAt: new Date().toISOString().split('T')[0], 
    status: "Active" 
  };

  const [currentStore, setCurrentStore] = useState(emptyStore);

  const handleChange = (e) => {
    setCurrentStore({ ...currentStore, [e.target.name]: e.target.value });
  };

  const openModal = (store = emptyStore) => {
    setCurrentStore(store);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentStore.name || !currentStore.owner || !currentStore.contact) {
      toast.error("Please fill required fields");
      return;
    }

    if (currentStore.id) {
      // Edit logic: LocalStorage useEffect ki wajah se khud update ho jayega
      setStores(stores.map((s) => (s.id === currentStore.id ? currentStore : s)));
      toast.success("Store updated successfully");
    } else {
      // Add logic: New store created
      const newStore = { ...currentStore, id: Date.now() };
      setStores([...stores, newStore]);
      toast.success("New store created successfully");
    }
    setIsModalOpen(false);
  };

  const deleteStore = (id) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      setStores(stores.filter((s) => s.id !== id));
      toast.info("Store removed");
    }
  };

  const filteredStores = stores.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen mt-14 ml-64 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#13786E] tracking-tighter uppercase">Store Management</h1>
          <p className="text-gray-400 text-xs font-bold tracking-widest">PERSISTENT DATA STORAGE ENABLED</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#13786E] hover:bg-[#0e5a52] text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg active:scale-95 font-black uppercase tracking-widest text-xs transition-all"
        >
          <Plus size={18} /> Add New Store
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by store or owner..."
          className="w-full outline-none text-gray-700 bg-transparent font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stores Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Store / Owner</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Type / Contact</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Login</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Rent</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Reg. Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-teal-50/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-sm">{store.name}</span>
                      <span className="text-[11px] text-teal-600 font-bold uppercase">{store.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-700">{store.shopType}</span>
                      <span className="text-[11px] text-gray-400 font-medium">{store.contact}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded border border-gray-200 text-gray-500">
                        {store.email}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-[#13786E] text-sm">Rs. {store.monthlyRent}</span>
                  </td>
                  <td className="px-6 py-4 text-[11px] text-gray-500 font-bold">
                    {store.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                        store.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                        {store.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openModal(store)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                      <button onClick={() => deleteStore(store.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal with Grid Layout */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#13786E] p-6 flex justify-between items-center text-white">
              <h2 className="text-xl font-black uppercase tracking-widest">{currentStore.id ? "Update Store" : "New Registration"}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput label="Store Name" name="name" icon={<Store size={16}/>} value={currentStore.name} onChange={handleChange} />
                <FormInput label="Owner Name" name="owner" icon={<User size={16}/>} value={currentStore.owner} onChange={handleChange} />
                <div className="md:col-span-2">
                  <FormInput label="Full Address" name="address" icon={<MapPin size={16}/>} value={currentStore.address} onChange={handleChange} />
                </div>
                <FormInput label="Shop Type" name="shopType" icon={<Tag size={16}/>} value={currentStore.shopType} onChange={handleChange} />
                <FormInput label="Contact Number" name="contact" icon={<Phone size={16}/>} value={currentStore.contact} onChange={handleChange} />
                <FormInput label="Login Email" name="email" type="email" icon={<Mail size={16}/>} value={currentStore.email} onChange={handleChange} />
                <FormInput label="Monthly Rent (Rs)" name="monthlyRent" type="number" icon={<DollarSign size={16}/>} value={currentStore.monthlyRent} onChange={handleChange} />
                <FormInput label="Creation Date" name="createdAt" type="date" icon={<Calendar size={16}/>} value={currentStore.createdAt} onChange={handleChange} />
              </div>
              <div className="pt-8 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-bold text-gray-400 uppercase text-xs">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-[#13786E] text-white rounded-xl font-bold shadow-lg uppercase text-xs tracking-widest">Save Store Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const FormInput = ({ label, icon, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
      <span className="text-[#13786E]">{icon}</span> {label}
    </label>
    <input {...props} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#13786E] outline-none transition-all bg-gray-50/50 text-sm font-medium" />
  </div>
);

export default StoreManagement;