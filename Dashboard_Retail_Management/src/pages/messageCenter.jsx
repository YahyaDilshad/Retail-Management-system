import React, { useState, useEffect } from "react";
import { 
  MessageSquare, Send, Users, User, Search, Clock, Trash2, Loader
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";

const MessageCenter = () => {
  const [stores, setStores] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState("all");
  const [messageText, setMessageText] = useState("");

  // --- 1. FETCH DATA (Stores and History) ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [storesRes, historyRes] = await Promise.all([
        axiosInstance.get("/stores/all"),
        axiosInstance.get("/messages/history")
      ]);
      setStores(storesRes.data);
      setSentMessages(historyRes.data);
    } catch (error) {
      toast.error("Failed to sync with server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. SEND MESSAGE LOGIC ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return toast.error("Please type a message");

    const recipientStore = stores.find(s => s._id === selectedRecipient);
    
    const payload = {
      recipient: selectedRecipient, // "all" or ID
      recipientName: selectedRecipient === "all" ? "All Stores" : recipientStore?.name,
      text: messageText,
      type: selectedRecipient === "all" ? "broadcast" : "individual"
    };

    try {
      const res = await axiosInstance.post("/messages/send", payload);
      setSentMessages([res.data, ...sentMessages]);
      setMessageText("");
      toast.success(selectedRecipient === "all" ? "Broadcast Sent!" : "Message Sent!");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  // --- 3. DELETE HISTORY ---
  const deleteHistory = async (id) => {
    try {
      await axiosInstance.delete(`/messages/delete/${id}`);
      setSentMessages(sentMessages.filter(m => m._id !== id));
      toast.info("Record removed");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex-1 ml-64 min-h-screen bg-[#F8FAFC] p-8 mt-14 text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#13786E] tracking-tighter uppercase italic flex items-center gap-3">
          <MessageSquare /> Global Message Center
        </h1>
        <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase">
            {isLoading ? "Syncing..." : "Real-time communication active"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <form onSubmit={handleSendMessage} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Select Audience</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRecipient("all")}
                    className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold ${
                      selectedRecipient === "all" 
                      ? "border-[#13786E] bg-teal-50 text-[#13786E]" 
                      : "border-gray-100 bg-gray-50 text-gray-400"
                    }`}
                  >
                    <Users size={20} /> ALL STORES
                  </button>
                  
                  <select
                    value={selectedRecipient !== "all" ? selectedRecipient : ""}
                    onChange={(e) => setSelectedRecipient(e.target.value)}
                    className="p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 outline-none text-sm font-bold text-gray-500"
                  >
                    <option value="" disabled>Select Specific Store</option>
                    {stores.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Message Content</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Enter announcement text..."
                  className="w-full h-40 p-5 rounded-3xl border border-gray-200 outline-none bg-gray-50 focus:ring-2 focus:ring-[#13786E] transition-all font-medium"
                />
              </div>

              <button type="submit" className="w-full bg-[#13786E] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95">
                <Send size={18} /> {selectedRecipient === "all" ? "Broadcast Bulk Message" : "Send Individual Message"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-[600px] flex flex-col overflow-hidden">
          <div className="p-6 border-b bg-gray-50/50">
            <h2 className="font-black text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} className="text-[#13786E]" /> Recent Log
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {sentMessages.map((msg) => (
              <div key={msg._id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 relative group">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${
                    msg.type === 'broadcast' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {msg.type}
                  </span>
                  <button onClick={() => deleteHistory(msg._id)} className="opacity-0 group-hover:opacity-100 text-red-400 transition-opacity"><Trash2 size={14}/></button>
                </div>
                <p className="text-[10px] font-black text-[#13786E] uppercase">To: {msg.recipientName}</p>
                <p className="text-sm text-gray-700 mt-1">{msg.text}</p>
                <p className="text-[9px] text-gray-400 mt-2 font-bold">{msg.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;