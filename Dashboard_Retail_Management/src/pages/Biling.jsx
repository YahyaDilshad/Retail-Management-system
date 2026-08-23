import React, { useState, useMemo, useEffect } from "react";
import { 
  ReceiptCent, Search, Plus, Minus, Trash2, 
  User, Phone, ShoppingBag, CreditCard, X, Printer, RefreshCcw, Loader
} from "lucide-react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

const Billing = () => {
  // --- 1. FETCH PROFILE DATA (To sync with Billing) ---
  const { data: authData } = useQuery({ queryKey: ["authUser"] });
  const storeUser = JSON.parse(localStorage.getItem("activeStore"));
  
  // Jo profile mein user hai (Admin ya Store)
  const profile = authData?.user || storeUser;

  // 2. Dummy Products (Inhein aap backend products se map kar sakte hain)
  const [products] = useState([
    { id: 1, name: "Premium Basmati Rice 5kg", price: 1250, category: "Grocery", stock: 25 },
    { id: 2, name: "Cooking Oil 5L", price: 2450, category: "Grocery", stock: 15 },
    { id: 3, name: "Dairy Milk Chocolate", price: 180, category: "Snacks", stock: 50 },
    { id: 4, name: "Handwash 250ml", price: 350, category: "Personal Care", stock: 10 },
  ]);

  // 3. Billing States
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [discount, setDiscount] = useState(0);

  // --- SYNC LOGIC: Profile data ko billing mein set karna ---
  useEffect(() => {
    if (profile) {
      setCustomer({
        name: profile.username || profile.name || "",
        phone: profile.phone || profile.contact || ""
      });
    }
  }, [profile]);

  // 4. Cart Logic
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setSearchTerm("");
    toast.success(`${product.name} added`);
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

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  // 5. Calculations
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.qty), 0), [cart]);
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax - discount;

  const handleCheckout = () => {
    if (cart.length === 0) return toast.error("Cart is empty!");
    toast.success("Bill Generated Successfully!");
    setCart([]);
    setDiscount(0);
    // Note: Customer info reset nahi ki taake bar bar login data na bharna pare
  };

  return (
    <div className="flex-1 ml-64 min-h-screen bg-gray-50 p-6 mt-14 font-sans text-left overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#13786E] uppercase tracking-tighter flex items-center gap-2">
            <ReceiptCent size={28} /> Terminal Billing
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Operator: <span className="text-[#13786E]">{profile?.username || profile?.name || "System"}</span>
          </p>
        </div>
        <button onClick={() => setCart([])} className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase hover:bg-red-50 p-2 rounded-lg transition-all">
          <RefreshCcw size={14} /> Reset Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
        
        {/* LEFT: Cart & Search */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative">
            <div className="flex items-center gap-3">
              <Search className="text-gray-400" size={22} />
              <input 
                type="text" placeholder="Search products..." 
                className="w-full outline-none font-bold text-gray-700 bg-transparent"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                  <button key={p.id} onClick={() => addToCart(p)} className="w-full p-4 flex justify-between items-center hover:bg-teal-50 border-b border-gray-50 last:border-0 transition-colors">
                    <div className="text-left"><p className="font-bold text-gray-800 text-sm">{p.name}</p></div>
                    <span className="font-black text-[#13786E]">Rs. {p.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left font-medium">
                <thead className="bg-gray-50/50 sticky top-0 backdrop-blur-md z-10 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Description</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-center">Qty</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-right">Subtotal</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cart.map((item) => (
                    <tr key={item.id} className="hover:bg-teal-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                        <p className="text-[9px] text-gray-400 font-black uppercase">Unit: Rs.{item.price}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-4">
                          <button onClick={() => updateQty(item.id, -1)} className="p-1 text-gray-400 hover:text-red-500"><Minus size={14}/></button>
                          <span className="font-black text-sm w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="p-1 text-[#13786E] hover:scale-125"><Plus size={14}/></button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-gray-800 text-sm">Rs. {item.price * item.qty}</td>
                      <td className="px-6 py-4 text-center"><button onClick={() => removeFromCart(item.id)} className="text-red-300 hover:text-red-500"><Trash2 size={18}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: Profile Synced Customer Info & Totals */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 border-t-4 border-t-[#13786E]">
            <h2 className="text-[10px] font-black uppercase text-[#13786E] tracking-[2px] mb-4 flex items-center gap-2">
              <User size={14}/> Registered Identity
            </h2>
            <div className="space-y-4">
              <div className="relative">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16}/>
                 <input 
                   type="text" placeholder="Name" 
                   className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700"
                   value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})}
                 />
              </div>
              <div className="relative">
                 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16}/>
                 <input 
                   type="text" placeholder="Phone" 
                   className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700"
                   value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                 />
              </div>
              <p className="text-[9px] text-gray-400 italic text-center font-medium">Fields are automatically synced with your profile settings.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex-1 flex flex-col">
            <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6">Payment Summary</h2>
            <div className="space-y-4 flex-1">
              <div className="flex justify-between font-bold text-gray-400 text-sm"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
              <div className="flex justify-between font-bold text-gray-400 text-sm"><span>GST (5%)</span><span>Rs. {tax.toFixed(0)}</span></div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discount</span>
                <div className="flex items-center gap-2 bg-teal-50 px-3 py-1 rounded-xl">
                    <span className="text-xs font-black text-[#13786E]">Rs.</span>
                    <input type="number" className="w-16 bg-transparent text-right outline-none font-black text-[#13786E]" value={discount} onChange={(e) => setDiscount(Number(e.target.value))}/>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t-4 border-dashed border-gray-50">
                <p className="text-[10px] font-black text-[#13786E] uppercase tracking-[3px]">Grand Total</p>
                <h3 className="text-3xl font-black text-gray-800 tracking-tighter">Rs. {grandTotal.toLocaleString()}</h3>
              </div>
            </div>
            <button onClick={handleCheckout} className="w-full bg-[#13786E] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all mt-6"><CreditCard size={18}/> Pay & Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;