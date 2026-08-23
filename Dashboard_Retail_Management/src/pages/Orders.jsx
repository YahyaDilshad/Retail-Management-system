import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, Search, Eye, Trash2, CheckCircle, 
  X, Printer, Calendar, CreditCard, User, Plus, Minus, Package
} from "lucide-react";
import { toast } from "react-toastify";

const Orders = () => {
  // --- 1. INITIAL DATA ---
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("apex_orders_list");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem("apex_orders_list", JSON.stringify(orders));
  }, [orders]);

  // --- 2. STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [showAddModal, setShowAddModal] = useState(false);

  // New Order Form State
  const [newOrder, setNewOrder] = useState({
    customer: "",
    payment: "Cash",
    items: [{ name: "", qty: 1, price: "" }]
  });

  // --- 3. ADD ORDER LOGIC ---
  const addItemRow = () => {
    setNewOrder({ ...newOrder, items: [...newOrder.items, { name: "", qty: 1, price: "" }] });
  };

  const removeItemRow = (index) => {
    const updatedItems = newOrder.items.filter((_, i) => i !== index);
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index][field] = value;
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const handleSaveOrder = (e) => {
    e.preventDefault();
    if (!newOrder.customer || newOrder.items[0].name === "") {
      return toast.error("Please fill customer name and at least one item");
    }

    const totalAmount = newOrder.items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.price)), 0);
    
    const finalOrder = {
      ...newOrder,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      amount: totalAmount,
      status: "Completed"
    };

    setOrders([finalOrder, ...orders]);
    setShowAddModal(false);
    setSelectedOrder(finalOrder); // Automatically open for printing
    toast.success("Order Saved Successfully!");
    setNewOrder({ customer: "", payment: "Cash", items: [{ name: "", qty: 1, price: "" }] });
  };

  // --- 4. OTHER ACTIONS ---
  const deleteOrder = (id) => {
    if (window.confirm("Delete this order?")) {
      setOrders(orders.filter(o => o.id !== id));
      toast.error("Order deleted");
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.includes(searchTerm);
    const matchesTab = activeTab === "All" || o.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex-1 ml-64 min-h-screen bg-gray-50 p-8 mt-14 font-sans text-left text-gray-800">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#13786E] tracking-tighter uppercase italic flex items-center gap-3">
            <ShoppingCart size={32} /> Order Management
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">Cloud Order Tracking System</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#13786E] text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-teal-900/20 active:scale-95 flex items-center gap-2"
        >
          <Plus size={18}/> Create New Order
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
           {["All", "Pending", "Completed"].map(tab => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-[#13786E] text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}>{tab}</button>
           ))}
        </div>
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search Order..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2rem] shadow-md border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Payment</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-teal-50/30 transition-colors group">
                  <td className="px-8 py-5 font-black text-[#13786E] text-sm">{order.id}</td>
                  <td className="px-8 py-5 font-bold text-gray-700 text-sm">{order.customer}</td>
                  <td className="px-8 py-5 font-black text-gray-800 text-sm">Rs. {order.amount.toLocaleString()}</td>
                  <td className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">{order.payment}</td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setSelectedOrder(order)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"><Eye size={16}/></button>
                      <button onClick={() => deleteOrder(order.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>

      {/* --- ADD ORDER MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
             <div className="bg-[#13786E] p-6 flex justify-between items-center text-white">
                <h2 className="text-xl font-black uppercase tracking-widest">New Order Entry</h2>
                <button onClick={() => setShowAddModal(false)}><X size={24} /></button>
             </div>
             
             <form onSubmit={handleSaveOrder} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Customer Name</label>
                    <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold" value={newOrder.customer} onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Method</label>
                    <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold" value={newOrder.payment} onChange={(e) => setNewOrder({...newOrder, payment: e.target.value})}>
                      <option value="Cash">Cash on Counter</option>
                      <option value="Card">Credit/Debit Card</option>
                      <option value="Online">Online Transfer</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center border-b pb-2 border-gray-100">
                      <h3 className="text-[10px] font-black text-[#13786E] uppercase tracking-[2px]">Order Items List</h3>
                      <button type="button" onClick={addItemRow} className="text-xs font-black text-teal-600 flex items-center gap-1 hover:underline"><Plus size={14}/> Add Row</button>
                   </div>
                   
                   <div className="max-h-48 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                      {newOrder.items.map((item, index) => (
                        <div key={index} className="flex gap-4 items-end animate-in slide-in-from-right-2">
                           <div className="flex-1">
                              <input placeholder="Item Name" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold" value={item.name} onChange={(e) => handleItemChange(index, "name", e.target.value)}/>
                           </div>
                           <div className="w-24">
                              <input type="number" placeholder="Qty" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold" value={item.qty} onChange={(e) => handleItemChange(index, "qty", e.target.value)}/>
                           </div>
                           <div className="w-32">
                              <input type="number" placeholder="Price" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold" value={item.price} onChange={(e) => handleItemChange(index, "price", e.target.value)}/>
                           </div>
                           {index > 0 && (
                             <button type="button" onClick={() => removeItemRow(index)} className="p-3 text-red-400"><Minus size={18}/></button>
                           )}
                        </div>
                      ))}
                   </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                   <div className="text-left">
                      <p className="text-[10px] font-black text-gray-400 uppercase">Estimated Total</p>
                      <p className="text-2xl font-black text-[#13786E]">Rs. {newOrder.items.reduce((sum, item) => sum + (item.qty * item.price), 0).toLocaleString()}</p>
                   </div>
                   <button type="submit" className="px-12 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl">Complete & Save Order</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* --- INVOICE VIEW MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
            <div className="p-8 text-center border-b border-dashed border-gray-200">
               <h2 className="text-2xl font-black uppercase tracking-tighter text-[#13786E]">Apexiums Retail</h2>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[4px]">Invoice Receipt</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex justify-between text-[11px] font-black text-gray-500 uppercase">
                <div>
                   <p>Bill To: <span className="text-gray-800">{selectedOrder.customer}</span></p>
                   <p>Date: <span className="text-gray-800">{selectedOrder.date}</span></p>
                </div>
                <div className="text-right">
                   <p>Order ID: <span className="text-gray-800">{selectedOrder.id}</span></p>
                   <p>Method: <span className="text-gray-800">{selectedOrder.payment}</span></p>
                </div>
              </div>

              <div className="border-y border-gray-100 py-4">
                <table className="w-full text-left">
                   <thead className="text-[9px] font-black text-gray-400 uppercase">
                      <tr><th>Item</th><th className="text-center">Qty</th><th className="text-right">Total</th></tr>
                   </thead>
                   <tbody className="text-xs font-bold text-gray-700">
                      {selectedOrder.items.map((it, i) => (
                        <tr key={i}><td className="py-2">{it.name}</td><td className="text-center">{it.qty}</td><td className="text-right">Rs. {it.qty * it.price}</td></tr>
                      ))}
                   </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center">
                 <p className="text-sm font-black uppercase">Grand Total</p>
                 <p className="text-2xl font-black text-[#13786E]">Rs. {selectedOrder.amount.toLocaleString()}</p>
              </div>

              <div className="flex gap-4 pt-6 print:hidden">
                <button onClick={() => setSelectedOrder(null)} className="flex-1 py-4 border border-gray-200 rounded-2xl font-black text-gray-400 uppercase text-[10px]">Close</button>
                <button onClick={() => window.print()} className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"><Printer size={16}/> Print Invoice</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        @media print { .ml-64, button { display: none !important; } .fixed { position: relative !important; background: white !important; } }
      `}</style>
    </div>
  );
};

export default Orders;