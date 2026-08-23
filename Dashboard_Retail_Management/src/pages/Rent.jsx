import React, { useState, useEffect } from "react";
import { 
  Key, Plus, Edit2, Trash2, Search, X, 
  DollarSign, Calendar, Store, CheckCircle, Clock, Loader 
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";

const RentManagement = () => {
  const [rentRecords, setRentRecords] = useState([]);
  const [stores, setStores] = useState([]); // Stores list ke liye state
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const emptyRecord = { 
    storeName: "", month: "", amount: "", status: "Pending", paymentDate: "" 
  };
  const [currentRecord, setCurrentRecord] = useState(emptyRecord);

  // --- 1. FETCH DATA (Rent Records and Store List) ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Dono APIs ko ek sath call kar rahe hain
      const [rentRes, storesRes] = await Promise.all([
        axiosInstance.get("/rent/all"),
        axiosInstance.get("/stores/all")
      ]);
      setRentRecords(rentRes.data);
      setStores(storesRes.data); // Backend se stores fetch ho gaye
    } catch (error) {
      toast.error("Failed to sync data with server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. CALCULATIONS ---
  const totalCollected = rentRecords
    .filter(r => r.status === "Paid")
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const totalPending = rentRecords
    .filter(r => r.status === "Pending")
    .reduce((sum, r) => sum + Number(r.amount), 0);

  // --- 3. CRUD FUNCTIONS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentRecord.storeName || !currentRecord.month || !currentRecord.amount) {
      return toast.error("Please fill all required fields");
    }

    try {
      if (currentRecord._id) {
        const res = await axiosInstance.put(`/rent/update/${currentRecord._id}`, currentRecord);
        setRentRecords(rentRecords.map((r) => (r._id === currentRecord._id ? res.data : r)));
        toast.success("Rent record updated");
      } else {
        const res = await axiosInstance.post("/rent/add", currentRecord);
        setRentRecords([res.data, ...rentRecords]);
        toast.success("New rent record added");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const deleteRecord = async (id) => {
    if (window.confirm("Delete this rent record?")) {
      try {
        await axiosInstance.delete(`/rent/delete/${id}`);
        setRentRecords(rentRecords.filter((r) => r._id !== id));
        toast.info("Record removed");
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  const filteredRecords = rentRecords.filter((r) =>
    r.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen mt-14 ml-64 font-sans text-left">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#13786E] tracking-tighter uppercase italic">Rent Management</h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">
             {isLoading ? "REFRESHING DATA..." : "LIVE CLOUD LEASE TRACKING"}
          </p>
        </div>
        <button
          onClick={() => { setCurrentRecord(emptyRecord); setIsModalOpen(true); }}
          className="bg-[#13786E] hover:bg-[#0e5a52] text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg active:scale-95 font-black uppercase tracking-widest text-[10px] transition-all"
        >
          <Plus size={18} /> Add Rent Entry
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-green-50 p-4 rounded-xl text-green-600 shadow-inner"><CheckCircle size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Collected</p>
            <h3 className="text-xl font-black text-gray-800">Rs. {totalCollected.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-orange-50 p-4 rounded-xl text-orange-600 shadow-inner"><Clock size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pending</p>
            <h3 className="text-xl font-black text-gray-800">Rs. {totalPending.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by store or month..."
          className="w-full outline-none text-gray-700 bg-transparent font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Store Details</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Billing Month</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Rent Amount</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {filteredRecords.map((record) => (
              <tr key={record._id} className="hover:bg-teal-50/40 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 p-2 rounded-lg text-[#13786E]"><Store size={16}/></div>
                    <span className="font-bold text-gray-800 text-sm">{record.storeName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{record.month}</td>
                <td className="px-6 py-4 font-black text-gray-800 text-sm">Rs. {Number(record.amount).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border tracking-tighter ${
                    record.status === "Paid" ? "bg-green-100 text-green-700 border-green-200" : "bg-orange-100 text-orange-700 border-orange-200"
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setCurrentRecord(record); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => deleteRecord(record._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRecords.length === 0 && <div className="p-20 text-center text-gray-300 font-bold uppercase text-xs">No records found.</div>}
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-[#13786E] p-8 flex justify-between items-center text-white">
              <h2 className="text-xl font-black uppercase tracking-widest">{currentRecord._id ? "Update Rent" : "New Rent Entry"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-2 rounded-full"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              
              {/* STORE SELECT DROPDOWN */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Store</label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-[#13786E]" size={18} />
                  <select 
                    name="storeName" 
                    value={currentRecord.storeName} 
                    onChange={(e) => setCurrentRecord({...currentRecord, storeName: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700 appearance-none transition-all"
                  >
                    <option value="">Choose a Store...</option>
                    {stores.map(store => (
                      <option key={store._id} value={store.name}>{store.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Billing Month</label>
                  <input 
                    type="text" placeholder="e.g. Feb 2024" value={currentRecord.month}
                    onChange={(e) => setCurrentRecord({...currentRecord, month: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount (Rs)</label>
                  <input 
                    type="number" value={currentRecord.amount}
                    onChange={(e) => setCurrentRecord({...currentRecord, amount: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-black text-teal-700" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Status</label>
                  <select 
                    value={currentRecord.status}
                    onChange={(e) => setCurrentRecord({...currentRecord, status: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Date</label>
                  <input 
                    type="date" value={currentRecord.paymentDate}
                    onChange={(e) => setCurrentRecord({...currentRecord, paymentDate: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-medium" 
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 border border-gray-200 rounded-2xl font-black text-gray-400 uppercase text-[10px] tracking-widest transition-all">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-teal-900/20 transition-all active:scale-95">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentManagement;