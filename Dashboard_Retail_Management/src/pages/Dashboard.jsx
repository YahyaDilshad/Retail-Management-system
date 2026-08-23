import React, { useState } from 'react'
import { 
  LayoutDashboard, Store, Key, TrendingUp, Crown, 
  Activity, Calendar, ArrowUpRight, ShoppingCart, 
  ShieldCheck, HandCoins, Package, Users, Building, 
  TrendingDown, Barcode, ArrowRight 
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom' // useNavigate add kiya
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts'

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("August 2024");

  // --- MONTHS LIST (Starting from August) ---
  const months = [
    "August 2026", "September 2026", "October 2026", 
    "November 2026", "December 2026", "January 2027"
  ];

  // --- ROLE DETECTION ---
  const storeUser = JSON.parse(localStorage.getItem("activeStore"));
  const role = storeUser ? "store" : "admin";

  // --- Mock Data for 30 Days Trend ---
  const chartData = [
    { day: '01', rev: 4000 }, { day: '05', rev: 3000 }, { day: '10', rev: 5000 },
    { day: '15', rev: 4500 }, { day: '20', rev: 6000 }, { day: '25', rev: 5500 },
    { day: '30', rev: 8000 },
  ];

  // --- ADMIN STATS CARDS ---
  const adminStats = [
    { label: "Total Stores", count: "12", icon: <Store size={24} />, to: "/admin/store", color: "#13786E", bg: "bg-teal-50", desc: "Live Outlets" },
    { label: "Monthly Rent", count: "Rs. 450k", icon: <Key size={24} />, to: "/admin/rent", color: "#3B82F6", bg: "bg-blue-50", desc: "Expected" },
    { label: "Total Revenue", count: "Rs. 890k", icon: <TrendingUp size={24} />, to: "/admin/revenue", color: "#10B981", bg: "bg-emerald-50", desc: "+12% Growth" },
    { label: "Defaulters", count: "04", icon: <Activity size={24} />, to: "/admin/customerstatus", color: "#EF4444", bg: "bg-red-50", desc: "Needs Attention" }
  ];

  // --- STORE STATS CARDS ---
  const storeStats = [
    { label: "Total Revenue", count: "Rs. 1.2M", icon: <TrendingUp size={24}/>, color: "#10B981", bg: "bg-emerald-50", desc: "Overall Earnings" },
    { label: "Net Profit", count: "Rs. 450k", icon: <TrendingUp size={24}/>, color: "#13786E", bg: "bg-teal-50", desc: "After Expenses" },
    { label: "Active Portal", count: "1 Active", icon: <ShieldCheck size={24}/>, color: "#3B82F6", bg: "bg-blue-50", desc: "Session Secure" },
    { label: "Total Debt", count: "Rs. 85k", icon: <HandCoins size={24}/>, color: "#EF4444", bg: "bg-red-50", desc: "Udhaar Recovery" },
    { label: "Total Products", count: "1,420", icon: <Package size={24}/>, color: "#8B5CF6", bg: "bg-purple-50", desc: "In Inventory" },
    { label: "Total Expense", count: "Rs. 120k", icon: <TrendingDown size={24}/>, color: "#F59E0B", bg: "bg-amber-50", desc: "Bills & More" },
    { label: "Total Orders", count: "852", icon: <ShoppingCart size={24}/>, color: "#06B6D4", bg: "bg-cyan-50", desc: "Sales Volume" },
    { label: "Total Staff", count: "12", icon: <Users size={24}/>, color: "#EC4899", bg: "bg-pink-50", desc: "On Duty" },
    { label: "Total Agencies", count: "08", icon: <Building size={24}/>, color: "#64748B", bg: "bg-slate-50", desc: "Partners" },
  ];

  const currentStats = role === "admin" ? adminStats : storeStats;

  return (
    <div className='flex-1 ml-64 min-h-screen bg-[#F8FAFC] p-8 mt-14 text-left font-sans'>
      
      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 tracking-tighter flex items-center gap-3 uppercase italic'>
            {role === "admin" ? "Admin Control Center" : `${storeUser?.name} Dashboard`}
          </h1>
          <p className='text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1'>
            {role === "admin" ? "Global System Performance" : "Store Performance Analytics"}
          </p>
        </div>

        {/* --- UPDATED MONTH SELECTOR --- */}
        <div className='bg-white p-1 rounded-2xl border border-gray-200 flex shadow-sm items-center px-4'>
          <Calendar size={16} className="text-[#13786E]" />
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className='bg-transparent outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer py-2.5 pl-2'
          >
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${role === 'admin' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 mb-10`}>
        {currentStats.map((item, idx) => (
          <div key={idx} className='group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden'>
            <div className='flex items-center gap-4 mb-4 relative z-10'>
              <div className={`${item.bg} p-4 rounded-2xl transition-all group-hover:scale-110 shadow-inner`} style={{ color: item.color }}>
                {item.icon}
              </div>
              <div className='overflow-hidden'>
                <h3 className='text-gray-400 font-black text-[9px] uppercase tracking-widest truncate'>{item.label}</h3>
                <p className='text-xl font-black text-gray-800 truncate tracking-tighter'>{item.count}</p>
              </div>
            </div>
            <div className='mt-auto pt-4 border-t border-gray-50 flex items-center justify-between'>
              <span className='text-[9px] font-bold text-gray-400 uppercase tracking-widest'>{item.desc}</span>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* REVENUE ANALYTICS CHART */}
      <div className='bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-10'>
        <div className='flex items-center justify-between mb-10'>
          <div>
            <h3 className='text-sm font-black text-gray-800 uppercase tracking-widest'>30 Days Performance Trend</h3>
            <p className='text-[10px] text-gray-400 font-bold uppercase mt-1'>Real-time growth visualization ({selectedMonth})</p>
          </div>
          <div className='hidden sm:flex items-center gap-4 text-[9px] font-black uppercase tracking-tighter'>
              <div className='flex items-center gap-1.5'><span className='w-2 h-2 bg-[#13786E] rounded-full'></span> Revenue</div>
              <div className='flex items-center gap-1.5'><span className='w-2 h-2 bg-teal-300 rounded-full animate-pulse'></span> Active Sync</div>
          </div>
        </div>

        <div className='h-[300px] w-full'>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#13786E" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#13786E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} />
              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="rev" stroke="#13786E" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BOTTOM SECTION: BARCODE (Store Only) */}
      {role === "store" && (
        <div className='bg-gray-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500'>
          <Barcode size={200} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
          
          <div className='relative z-10 text-center md:text-left'>
            <div className='flex items-center justify-center md:justify-start gap-3 mb-4'>
              <div className='bg-teal-500 p-2 rounded-lg'><Barcode size={20} /></div>
              <h2 className='text-xl font-black uppercase tracking-widest'>Barcode System</h2>
            </div>
            <h3 className='text-3xl font-light leading-tight'>Add new items to inventory? <br/> <span className='font-black text-teal-400 uppercase'>Print barcodes instantly.</span></h3>
          </div>

          {/* Fixed Navigation Logic */}
          <button 
            onClick={() => navigate('/admin/scanner')} 
            className='mt-8 md:mt-0 bg-white text-gray-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-teal-500 hover:text-white transition-all shadow-xl active:scale-95 group relative z-10'
          >
            Go to Scanner <ArrowRight size={18} className='group-hover:translate-x-2 transition-transform' />
          </button>
        </div>
      )}

    </div>
  )
}

export default Dashboard;