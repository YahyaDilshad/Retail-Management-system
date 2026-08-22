import React, { useState, useEffect } from "react";
import { 
  Key, Plus, Edit2, Trash2, Search, X, 
  DollarSign, Calendar, Store, CheckCircle, Clock 
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios"; // Axios instance use kiya gaya hai

const RentManagement = () => {
  const [rentRecords, setRentRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const emptyRecord = { 
    storeName: "", month: "", amount: "", status: "Pending", paymentDate: "" 
  };
  const [currentRecord, setCurrentRecord] = useState(emptyRecord);

  // --- 1. FETCH DATA FROM BACKEND ---
  const fetchRentData = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/rent/all");
      setRentRecords(res.data);
    } catch (error) {
      toast.error("Failed to load rent records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRentData();
  }, []);

  // --- 2. CALCULATIONS (Live from State) ---
  const totalCollected = rentRecords
    .filter(r => r.status === "Paid")
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const totalPending = rentRecords
    .filter(r => r.status === "Pending")
    .reduce((sum, r) => sum + Number(r.amount), 0);

  // --- 3. ADD OR UPDATE LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentRecord.storeName || !currentRecord.month || !currentRecord.amount) {
      return toast.error("Please fill all required fields");
    }

    try {
      if (currentRecord._id) {
        // Update Logic
        const res = await axiosInstance.put(`/rent/update/${currentRecord._id}`, currentRecord);
        setRentRecords(rentRecords.map((r) => (r._id === currentRecord._id ? res.data : r)));
        toast.success("Rent record updated");
      } else {
        // Add Logic
        const res = await axiosInstance.post("/rent/add", currentRecord);
        setRentRecords([res.data, ...rentRecords]);
        toast.success("New rent record added");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  // --- 4. DELETE LOGIC ---
  const deleteRecord = async (id) => {
    if (window.confirm("Delete this rent record?")) {
      try {
        await axiosInstance.delete(`/rent/delete/${id}`);
        setRentRecords(rentRecords.filter((r) => r._id !== id));
        toast.info("Record removed");
      } catch (error) {
        toast.error("Failed to delete record");
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
          <h1 className="text-3xl font-black text-[#13786E] tracking-tighter uppercase">Rent Management</h1>
          <p className="text-gray-400 text-xs font-bold tracking-widest mt-1">
             {isLoading ? "REFRESHING DATA..." : "LIVE CLOUD LEASE TRACKING"}
          </p>
        </div>
        <button
          onClick={() => { setCurrentRecord(emptyRecord); setIsModalOpen(true); }}
          className="bg-[#13786E] hover:bg-[#0e5a52] text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg active:scale-95 font-black uppercase tracking-widest text-xs transition-all"
        >
          <Plus size={18} /> Add Rent Entry
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-green-50 p-4 rounded-xl text-green-600"><CheckCircle size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Collected</p>
            <h3 className="text-xl font-black text-gray-800">Rs. {totalCollected.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-orange-50 p-4 rounded-xl text-orange-600"><Clock size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pending</p>
            <h3 className="text-xl font-black text-gray-800">Rs. {totalPending.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Search */}
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

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Store Details</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Billing Month</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Rent Amount</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRecords.map((record) => (
              <tr key={record._id} className="hover:bg-teal-50/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 p-2 rounded-lg text-[#13786E]"><Store size={16}/></div>
                    <span className="font-bold text-gray-800 text-sm">{record.storeName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-600">{record.month}</td>
                <td className="px-6 py-4 font-black text-gray-800 text-sm">Rs. {Number(record.amount).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                    record.status === "Paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => { setCurrentRecord(record); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => deleteRecord(record._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
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
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#13786E] p-6 flex justify-between items-center text-white">
              <h2 className="text-xl font-black uppercase tracking-widest">{currentRecord._id ? "Update Rent" : "New Rent Entry"}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">Store Name</label>
                <input 
                  type="text" name="storeName" value={currentRecord.storeName} 
                  onChange={(e) => setCurrentRecord({...currentRecord, storeName: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm font-medium" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Month</label>
                  <input 
                    type="text" placeholder="e.g. Sept 2024" value={currentRecord.month}
                    onChange={(e) => setCurrentRecord({...currentRecord, month: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</label>
                  <input 
                    type="number" value={currentRecord.amount}
                    onChange={(e) => setCurrentRecord({...currentRecord, amount: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                  <select 
                    value={currentRecord.status}
                    onChange={(e) => setCurrentRecord({...currentRecord, status: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Date</label>
                  <input 
                    type="date" value={currentRecord.paymentDate}
                    onChange={(e) => setCurrentRecord({...currentRecord, paymentDate: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm" 
                  />
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-bold text-gray-400 uppercase text-[10px]">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-[#13786E] text-white rounded-xl font-bold uppercase text-[10px] tracking-widest">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentManagement;