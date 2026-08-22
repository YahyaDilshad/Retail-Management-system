import React, { useState, useEffect } from "react";
import { 
  TrendingDown, Plus, Edit2, Trash2, Search, X, 
  DollarSign, Calendar, Tag, FileText
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const emptyExpense = { 
    title: "", category: "General", amount: "", date: new Date().toISOString().split('T')[0], note: "" 
  };
  const [currentExpense, setCurrentExpense] = useState(emptyExpense);

  // --- 1. FETCH EXPENSES FROM BACKEND ---
  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/expenses/all");
      setExpenses(res.data);
    } catch (error) {
      toast.error("Failed to load expenses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // --- 2. CALCULATIONS (Live) ---
  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  const handleChange = (e) => {
    setCurrentExpense({ ...currentExpense, [e.target.name]: e.target.value });
  };

  // --- 3. ADD OR UPDATE LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentExpense.title || !currentExpense.amount || !currentExpense.date) {
      return toast.error("Please fill required fields");
    }

    try {
      if (currentExpense._id) {
        // Update Logic
        const res = await axiosInstance.put(`/expenses/update/${currentExpense._id}`, currentExpense);
        setExpenses(expenses.map((ex) => (ex._id === currentExpense._id ? res.data : ex)));
        toast.success("Expense updated");
      } else {
        // Add Logic
        const res = await axiosInstance.post("/expenses/add", currentExpense);
        setExpenses([res.data, ...expenses]);
        toast.success("Expense recorded");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save expense");
    }
  };

  // --- 4. DELETE LOGIC ---
  const deleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axiosInstance.delete(`/expenses/delete/${id}`);
        setExpenses(expenses.filter((ex) => ex._id !== id));
        toast.info("Expense removed");
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const filteredExpenses = expenses.filter((ex) =>
    ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen mt-14 ml-64 font-sans text-left">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#13786E] tracking-tighter uppercase italic">Expense Tracker</h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] mt-1 uppercase">
            {isLoading ? "Syncing with Cloud..." : "Live Business Spendings"}
          </p>
        </div>
        <button
          onClick={() => { setCurrentExpense(emptyExpense); setIsModalOpen(true); }}
          className="bg-[#13786E] hover:bg-[#0e5a52] text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
        >
          <Plus size={18} /> Record New Expense
        </button>
      </div>

      {/* Stats Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between mb-8 max-w-sm">
        <div className="flex items-center gap-4">
          <div className="bg-red-50 p-4 rounded-2xl text-red-500 shadow-inner">
            <TrendingDown size={30} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Expenses</p>
            <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Rs. {totalExpense.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search expenses..."
          className="w-full outline-none text-gray-700 bg-transparent font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Expense Details</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Category</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Amount</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {filteredExpenses.map((ex) => (
              <tr key={ex._id} className="hover:bg-red-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-sm">{ex.title}</span>
                    <span className="text-[10px] text-gray-400 italic">{ex.note || "No notes"}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase border border-gray-200">
                    {ex.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-500">{ex.date}</td>
                <td className="px-6 py-4">
                  <span className="font-black text-red-500 text-sm">- Rs. {Number(ex.amount).toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => { setCurrentExpense(ex); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => deleteExpense(ex._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
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
              <h2 className="text-xl font-black uppercase tracking-widest">{currentExpense._id ? "Update Expense" : "New Expense"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-2 rounded-full"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">Expense Title</label>
                <input 
                  type="text" name="title" value={currentExpense.title}
                  onChange={handleChange}
                  placeholder="e.g. Electricity Bill"
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm font-medium" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</label>
                  <select 
                    name="category" value={currentExpense.category}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm font-bold"
                  >
                    <option value="General">General</option>
                    <option value="Utilities">Utilities (Bills)</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Food">Food / Kitchen</option>
                    <option value="Inventory">Inventory Purchase</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount (Rs)</label>
                  <input 
                    type="number" name="amount" value={currentExpense.amount}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm font-black" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</label>
                <input 
                  type="date" name="date" value={currentExpense.date}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm font-medium" 
                />
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 border border-gray-200 rounded-2xl font-black text-gray-400 uppercase text-[10px]">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;