import React, { useState, useEffect } from "react";
import { 
  Award, Plus, Edit2, Trash2, Search, X, 
  User, Phone, DollarSign, Calendar, AlertTriangle, Loader // AlertTriangle icon add kiya defaulter ke liye
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";

const CustomerStatus = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const emptyCustomer = { 
    name: "", contact: "", status: "Silver", totalSpent: "", lastVisit: new Date().toISOString().split('T')[0] 
  };
  const [currentCustomer, setCurrentCustomer] = useState(emptyCustomer);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/customers/all");
      setCustomers(res.data);
    } catch (error) {
      toast.error("Failed to load customer data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setCurrentCustomer({ ...currentCustomer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentCustomer.name || !currentCustomer.contact || !currentCustomer.totalSpent) {
      return toast.error("Please fill all required fields");
    }

    try {
      if (currentCustomer._id) {
        const res = await axiosInstance.put(`/customers/update/${currentCustomer._id}`, currentCustomer);
        setCustomers(customers.map((c) => (c._id === currentCustomer._id ? res.data : c)));
        toast.success("Status updated successfully");
      } else {
        const res = await axiosInstance.post("/customers/add", currentCustomer);
        setCustomers([res.data, ...customers]);
        toast.success("New customer added");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const deleteCustomer = async (id) => {
    if (window.confirm("Remove this customer from status list?")) {
      try {
        await axiosInstance.delete(`/customers/delete/${id}`);
        setCustomers(customers.filter((c) => c._id !== id));
        toast.info("Customer removed");
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- FIXED: Color logic and added Defaulter color (Red) ---
  const getStatusColor = (status) => {
    const s = status?.toLowerCase(); // Case sensitivity fix
    switch (s) {
      case "platinum": return "bg-blue-100 text-blue-700 border-blue-200";
      case "defaulter": return "bg-red-100 text-red-700 border-red-200"; // Red for danger
      case "gold": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen mt-14 ml-64 font-sans text-left text-gray-800">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#13786E] tracking-tighter uppercase italic">Customer Status</h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] mt-1 uppercase">
            {isLoading ? "Syncing..." : "Live Loyalty & Warning Tracking"}
          </p>
        </div>
        <button
          onClick={() => { setCurrentCustomer(emptyCustomer); setIsModalOpen(true); }}
          className="bg-[#13786E] text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
        >
          <Plus size={18} /> Add New Entry
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl text-blue-500 shadow-inner"><Award size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Members</p>
            <h3 className="text-xl font-black">{customers.length}</h3>
          </div>
        </div>
        
        {/* --- FIXED: Stats for Platinum and Defaulters --- */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-red-50 p-3 rounded-xl text-red-500 shadow-inner"><AlertTriangle size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Defaulters List</p>
            <h3 className="text-xl font-black">
              {customers.filter(c => c.status?.toLowerCase() === 'defaulter').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or status (defaulter, gold...)"
          className="w-full outline-none bg-transparent font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Customer / Contact</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Tier Status</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Total Spent</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Last Visit</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {filteredCustomers.map((c) => (
              <tr key={c._id} className="hover:bg-teal-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-sm">{c.name}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{c.contact}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-black text-gray-700 text-sm">Rs. {Number(c.totalSpent).toLocaleString()}</td>
                <td className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-tighter">{c.lastVisit}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setCurrentCustomer(c); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => deleteCustomer(c._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-[#13786E] p-8 flex justify-between items-center text-white">
              <h2 className="text-xl font-black uppercase tracking-widest">{currentCustomer._id ? "Edit Status" : "New Registration"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-2 rounded-full hover:rotate-90 transition-transform"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Customer Name</label>
                <input 
                  type="text" name="name" value={currentCustomer.name} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm font-medium" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status Tier</label>
                  <select name="status" value={currentCustomer.status} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 bg-gray-50/50 text-sm font-bold">
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="defaulter">defaulter</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Spent</label>
                  <input type="number" name="totalSpent" value={currentCustomer.totalSpent} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 bg-gray-50/50 text-sm font-black" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact No</label>
                  <input type="text" name="contact" value={currentCustomer.contact} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 bg-gray-50/50 text-sm font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Visit</label>
                  <input type="date" name="lastVisit" value={currentCustomer.lastVisit} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 bg-gray-50/50 text-sm font-medium" />
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 border border-gray-200 rounded-2xl font-black text-gray-400 uppercase text-[10px]">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerStatus;