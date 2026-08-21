import React, { useState } from "react";
import { 
  MessageSquare, 
  Send, 
  Users, 
  User, 
  Search, 
  CheckCircle,
  Clock,
  Trash2
} from "lucide-react";
import { toast } from "react-toastify";

const MessageCenter = () => {
  // Dummy Stores (Aap isay apne Store state se bhi connect kar sakte hain)
  const [stores] = useState([
    { id: 1, name: "Apexiums Central", owner: "Ali Ahmed" },
    { id: 2, name: "Apexiums North", owner: "Hamza Khan" },
    { id: 3, name: "Apexiums West", owner: "Sana Malik" },
    { id: 4, name: "Apexiums Mart", owner: "Zeeshan" },
  ]);

  const [selectedRecipient, setSelectedRecipient] = useState("all"); // "all" or specific store ID
  const [messageText, setMessageText] = useState("");
  const [sentMessages, setSentMessages] = useState([
    { id: 1, to: "All Stores", text: "Welcome to Apexiums Management!", time: "10:00 AM", type: "broadcast" }
  ]);

  // Handle Send Message
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageText.trim()) {
      return toast.error("Please type a message first");
    }

    const recipientName = selectedRecipient === "all" 
      ? "All Stores" 
      : stores.find(s => s.id === parseInt(selectedRecipient))?.name;

    const newMessage = {
      id: Date.now(),
      to: recipientName,
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: selectedRecipient === "all" ? "broadcast" : "individual"
    };

    // Update Local State (Simulation)
    setSentMessages([newMessage, ...sentMessages]);
    
    // Reset Form
    setMessageText("");
    toast.success(selectedRecipient === "all" ? "Broadcast message sent to all stores!" : `Message sent to ${recipientName}`);
  };

  const deleteHistory = (id) => {
    setSentMessages(sentMessages.filter(m => m.id !== id));
  };

  return (
    <div className="flex-1 ml-64 min-h-screen bg-[#F8FAFC] p-8 mt-14">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <MessageSquare className="text-[#13786E]" /> Message Center
        </h1>
        <p className="text-gray-500">Send updates or announcements to your retail outlets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Composer Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <form onSubmit={handleSendMessage} className="space-y-6">
              
              {/* Recipient Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Send Message To:</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRecipient("all")}
                    className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      selectedRecipient === "all" 
                      ? "border-[#13786E] bg-teal-50 text-[#13786E]" 
                      : "border-gray-100 bg-gray-50 text-gray-500"
                    }`}
                  >
                    <Users size={20} />
                    <span className="font-bold">All Stores</span>
                  </button>
                  
                  <div className="relative">
                    <select
                      value={selectedRecipient !== "all" ? selectedRecipient : ""}
                      onChange={(e) => setSelectedRecipient(e.target.value)}
                      className={`w-full h-full p-4 pl-10 rounded-2xl border-2 outline-none transition-all appearance-none ${
                        selectedRecipient !== "all" 
                        ? "border-[#13786E] bg-teal-50 text-[#13786E]" 
                        : "border-gray-100 bg-gray-50 text-gray-500"
                      }`}
                    >
                      <option value="" disabled>Select Specific Store</option>
                      {stores.map(store => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                      ))}
                    </select>
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Your Message:</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your announcement or message here..."
                  className="w-full h-44 p-5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#13786E] outline-none transition-all bg-gray-50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#13786E] hover:bg-[#0e5a52] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-teal-900/20 transition-all active:scale-95"
              >
                <Send size={20} /> {selectedRecipient === "all" ? "Broadcast to All Stores" : "Send Private Message"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Sent History */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-[600px] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
              <h2 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <Clock size={18} className="text-[#13786E]" /> Recent Activity
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {sentMessages.map((msg) => (
                <div key={msg.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 relative group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      msg.type === 'broadcast' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {msg.type}
                    </span>
                    <button 
                      onClick={() => deleteHistory(msg.id)}
                      className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-gray-500 mb-1">To: {msg.to}</p>
                  <p className="text-sm text-gray-700 line-clamp-3">{msg.text}</p>
                  <p className="text-[10px] text-gray-400 mt-2 text-right">{msg.time}</p>
                </div>
              ))}

              {sentMessages.length === 0 && (
                <div className="text-center py-10">
                  <MessageSquare size={40} className="mx-auto text-gray-200 mb-2" />
                  <p className="text-gray-400 text-sm italic">No messages sent yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default MessageCenter;