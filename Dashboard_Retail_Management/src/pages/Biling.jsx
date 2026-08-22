import React, { useState, useMemo } from "react";
import { 
  ReceiptCent, Search, Plus, Minus, Trash2, 
  User, Phone, ShoppingBag, CreditCard, X, Printer, RefreshCcw
} from "lucide-react";
import { toast } from "react-toastify";

const Billing = () => {
  // 1. Dummy Products for Search (Store Inventory)
  const [products] = useState([
    { id: 1, name: "Premium Basmati Rice 5kg", price: 1250, category: "Grocery", stock: 25 },
    { id: 2, name: "Cooking Oil 5L", price: 2450, category: "Grocery", stock: 15 },
    { id: 3, name: "Dairy Milk Chocolate", price: 180, category: "Snacks", stock: 50 },
    { id: 4, name: "Handwash 250ml", price: 350, category: "Personal Care", stock: 10 },
    { id: 5, name: "Mineral Water 1.5L", price: 90, category: "Beverages", stock: 100 },
  ]);

  // 2. Billing States
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [discount, setDiscount] = useState(0);

  // 3. Cart Logic
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setSearchTerm("");
    toast.success(`${product.name} added to bill`);
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // 4. Calculations
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.qty), 0), [cart]);
  const tax = subtotal * 0.05; // 5% GST
  const grandTotal = subtotal + tax - discount;

  // 5. Action Handlers
  const handleCheckout = () => {
    if (cart.length === 0) return toast.error("Cart is empty!");
    toast.success("Bill Generated & Printed Successfully!");
    // Reset after checkout
    setCart([]);
    setCustomer({ name: "", phone: "" });
    setDiscount(0);
  };

  return (
    <div className="flex-1 ml-64 min-h-screen bg-gray-50 p-6 mt-14 font-sans text-left overflow-hidden">
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#13786E] uppercase tracking-tighter flex items-center gap-2">
            <ReceiptCent size={28} /> Retail Billing Terminal
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">High-Speed POS System</p>
        </div>
        <button onClick={() => setCart([])} className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase hover:bg-red-50 p-2 rounded-lg transition-all">
          <RefreshCcw size={14} /> Clear Terminal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-160px)]">
        
        {/* LEFT COLUMN: Search & Item List */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
          
          {/* Product Search Box */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative">
            <div className="flex items-center gap-3">
              <Search className="text-gray-400" size={22} />
              <input 
                type="text" 
                placeholder="Search products by name or category..." 
                className="w-full outline-none font-bold text-gray-700 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Live Search Results Dropdown */}
            {searchTerm && (
              <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                  <button 
                    key={p.id} onClick={() => addToCart(p)}
                    className="w-full p-4 flex justify-between items-center hover:bg-teal-50 border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <div className="text-left">
                      <p className="font-bold text-gray-800 text-sm">{p.name}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase">{p.category} • Stock: {p.stock}</p>
                    </div>
                    <span className="font-black text-[#13786E]">Rs. {p.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart Table Area */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-gray-100/50 sticky top-0 backdrop-blur-md z-10">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Item Description</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Unit Price</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Quantity</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">Total</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cart.map((item) => (
                    <tr key={item.id} className="hover:bg-teal-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-700 text-sm">
                        {item.name}
                        <p className="text-[9px] text-gray-400 font-black uppercase">{item.category}</p>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-500 text-sm">Rs. {item.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-4">
                          <button onClick={() => updateQty(item.id, -1)} className="p-1.5 bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200"><Minus size={14}/></button>
                          <span className="font-black text-sm w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="p-1.5 bg-teal-50 rounded-lg text-[#13786E] hover:bg-teal-100"><Plus size={14}/></button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-gray-800 text-sm">Rs. {item.price * item.qty}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => removeFromCart(item.id)} className="text-red-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                  {cart.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                         <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                           <ShoppingBag size={32} className="text-gray-200" />
                         </div>
                         <p className="text-gray-300 font-black uppercase tracking-widest text-xs">Waiting for items...</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customer & Summary */}
        <div className="flex flex-col gap-6">
          
          {/* Customer Info Card */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
              <User size={14}/> Customer Information
            </h2>
            <div className="space-y-4">
              <div className="relative">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16}/>
                 <input 
                   type="text" placeholder="Customer Name" 
                   className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold"
                   value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})}
                 />
              </div>
              <div className="relative">
                 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16}/>
                 <input 
                   type="text" placeholder="Phone Number" 
                   className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold"
                   value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                 />
              </div>
            </div>
          </div>

          {/* Checkout Summary Card */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex-1 flex flex-col">
            <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6 border-b pb-4">Order Summary</h2>
            
            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                <span>GST (5%)</span>
                <span>Rs. {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discount</span>
                <div className="flex items-center gap-2 bg-teal-50 px-3 py-1 rounded-xl">
                    <span className="text-xs font-black text-[#13786E]">Rs.</span>
                    <input 
                      type="number" className="w-16 bg-transparent text-right outline-none font-black text-[#13786E]"
                      value={discount} onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-4 border-dashed border-gray-50">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-[#13786E] uppercase tracking-[3px]">Amount Payable</p>
                    <h3 className="text-3xl font-black text-gray-800 tracking-tighter">Rs. {grandTotal.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <button className="py-4 rounded-2xl border border-gray-200 text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all font-bold text-xs uppercase">
                <Printer size={16}/> Draft
              </button>
              <button 
                onClick={handleCheckout}
                className="py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-xl shadow-teal-900/20 active:scale-95 transition-all"
              >
                <CreditCard size={18}/> Pay & Checkout
              </button>
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

export default Billing;