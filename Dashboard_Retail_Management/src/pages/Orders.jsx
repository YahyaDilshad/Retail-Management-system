import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, Search, Eye, Trash2, CheckCircle, 
  Clock, XCircle, Filter, ChevronRight, X, Printer, 
  Calendar, CreditCard, User
} from "lucide-react";
import { toast } from "react-toastify";

const Orders = () => {
  // --- 1. INITIAL DUMMY DATA ---
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("apex_orders_list");
    return savedOrders ? JSON.parse(savedOrders) : [
      { 
        id: "ORD-8821", 
        customer: "M. Haris", 
        date: "2024-08-21", 
        amount: 3450, 
        status: "Completed", 
        payment: "Cash",
        items: [{ name: "Milk Pack 1L", qty: 2, price: 280 }, { name: "Cooking Oil 5L", qty: 1, price: 2450 }]
      },
      { 
        id: "ORD-9932", 
        customer: "Sana Khan", 
        date: "2024-08-22", 
        amount: 1200, 
        status: "Pending", 
        payment: "Card",
        items: [{ name: "Bread Large", qty: 3, price: 150 }, { name: "Jam 500g", qty: 1, price: 750 }]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("apex_orders_list", JSON.stringify(orders));
  }, [orders]);

  // --- 2. STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null); // For detail modal

  // --- 3. ACTIONS ---
  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    toast.info(`Order ${id} status updated to ${newStatus}`);
  };

  const deleteOrder = (id) => {
    if (window.confirm("Permanently delete this order record?")) {
      setOrders(orders.filter(o => o.id !== id));
      toast.error("Order deleted");
    }
  };

  // --- 4. FILTER LOGIC ---
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.includes(searchTerm);
    const matchesTab = activeTab === "All" || o.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700 border-green-200";
      case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex-1 ml-64 min-h-screen bg-gray-50 p-8 mt-14 font-sans text-left">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#13786E] tracking-tighter uppercase italic flex items-center gap-3">
            <ShoppingCart size={32} /> Order Management
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">Track Sales and Order Fulfillment</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase">Total Orders</p>
                <p className="text-lg font-black text-gray-800">{orders.length}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-center">
                <p className="text-[9px] font-black text-teal-500 uppercase">Revenue</p>
                <p className="text-lg font-black text-gray-800">Rs. {orders.reduce((sum, o) => sum + o.amount, 0)}</p>
            </div>
        </div>
      </div>

      {/* Toolbar: Tabs & Search */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
           {["All", "Pending", "Completed", "Cancelled"].map(tab => (
             <button 
                key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-[#13786E] text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
             >
               {tab}
             </button>
           ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" placeholder="Search Order ID or Name..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2rem] shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Payment</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-teal-50/30 transition-colors group">
                  <td className="px-8 py-5 font-black text-[#13786E] text-sm">{order.id}</td>
                  <td className="px-8 py-5 font-bold text-gray-700 text-sm">{order.customer}</td>
                  <td className="px-8 py-5 text-xs font-bold text-gray-400">{order.date}</td>
                  <td className="px-8 py-5 font-black text-gray-800 text-sm">Rs. {order.amount.toLocaleString()}</td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
                      <CreditCard size={12}/> {order.payment}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelectedOrder(order)} className="p-2 bg-blue-50 text-blue-600 rounded-lg" title="View Details"><Eye size={16}/></button>
                      <button onClick={() => updateStatus(order.id, "Completed")} className="p-2 bg-green-50 text-green-600 rounded-lg" title="Mark Done"><CheckCircle size={16}/></button>
                      <button onClick={() => deleteOrder(order.id)} className="p-2 bg-red-50 text-red-600 rounded-lg" title="Delete"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs italic">No orders matching your filters</div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-[#13786E] p-8 flex justify-between items-center text-white">
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest">Order Details</h2>
                <p className="text-[10px] text-teal-200 font-bold uppercase mt-1">Transaction ID: {selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="hover:rotate-90 transition-transform bg-white/10 p-2 rounded-full"><X size={24} /></button>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Info</p>
                  <p className="font-bold text-gray-800 flex items-center gap-2"><User size={14} className="text-[#13786E]"/> {selectedOrder.customer}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Date</p>
                  <p className="font-bold text-gray-800 flex items-center gap-2"><Calendar size={14} className="text-[#13786E]"/> {selectedOrder.date}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden mb-8">
                <table className="w-full text-left">
                  <thead className="bg-gray-100/50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-[9px] font-black text-gray-500 uppercase">Item Name</th>
                      <th className="px-6 py-3 text-[9px] font-black text-gray-500 uppercase text-center">Qty</th>
                      <th className="px-6 py-3 text-[9px] font-black text-gray-500 uppercase text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 text-xs font-bold text-gray-700">{item.name}</td>
                        <td className="px-6 py-4 text-xs font-black text-gray-400 text-center">{item.qty}</td>
                        <td className="px-6 py-4 text-xs font-black text-gray-800 text-right">Rs. {item.qty * item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase">Grand Total</p>
                  <p className="text-3xl font-black text-[#13786E] tracking-tighter">Rs. {selectedOrder.amount.toLocaleString()}</p>
                </div>
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95">
                  <Printer size={16}/> Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;