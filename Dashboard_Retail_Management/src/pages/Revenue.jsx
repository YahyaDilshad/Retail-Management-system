import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Calendar, Loader, Activity, BarChart3
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import axiosInstance from '../lib/axios';

const Revenue = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("August 2026");

  // --- 1. MONTHS LIST (Aug 2026 - Aug 2027) ---
  const monthsList = [
    "August 2026", "September 2026", "October 2026", "November 2026", "December 2026",
    "January 2027", "February 2027", "March 2027", "April 2027", "May 2027", 
    "June 2027", "July 2027", "August 2027"
  ];

  // --- 2. FETCH ANALYTICS BY MONTH ---
  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Backend ko selected month as a parameter bhej rahe hain
      const res = await axiosInstance.get(`/revenue/stats?month=${selectedMonth}`);
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching analytics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedMonth]); // Jab bhi month badle, data re-fetch ho

  if (isLoading) return (
    <div className="flex-1 ml-64 h-screen flex items-center justify-center bg-gray-50">
      <div className='flex flex-col items-center gap-3'>
        <Loader className="animate-spin text-[#13786E]" size={40} />
        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Syncing Financial Data...</p>
      </div>
    </div>
  );

  return (
    <div className='flex-1 ml-64 min-h-screen mt-14 bg-[#F8FAFC] p-8 text-left font-sans'>
      
      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 tracking-tighter uppercase italic flex items-center gap-3'>
            <BarChart3 className="text-[#13786E]" /> Revenue Analytics
          </h1>
          <p className='text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1'>Detailed financial breakdown for {selectedMonth}</p>
        </div>
        
        {/* MONTH SELECTOR */}
        <div className='bg-white border border-gray-200 p-1 rounded-2xl flex items-center shadow-sm px-4'>
          <Calendar size={16} className="text-[#13786E]" />
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer py-2.5 pl-2"
          >
            {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
        <StatCard 
          title="Monthly Revenue" 
          amount={`Rs. ${stats?.totalRevenue?.toLocaleString() || 0}`} 
          percentage="+14.2%" 
          isUp={true} 
          icon={<DollarSign size={22}/>} 
        />
        <StatCard 
          title="Average Rent" 
          amount={`Rs. ${stats?.avgOrderValue || 0}`} 
          percentage="Fixed" 
          isUp={true} 
          icon={<TrendingUp size={22}/>} 
        />
        <StatCard 
          title="Net Profit" 
          amount={`Rs. ${stats?.netProfit?.toLocaleString() || 0}`} 
          percentage="+5.7%" 
          isUp={true} 
          icon={<DollarSign size={22}/>} 
        />
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        
        {/* Main Trend Chart */}
        <div className='lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm'>
          <div className='flex items-center justify-between mb-10'>
            <div>
              <h3 className='font-black text-gray-800 text-sm uppercase tracking-widest'>Performance Trend</h3>
              <p className='text-[10px] text-gray-400 font-bold uppercase mt-1'>Visualization for {selectedMonth}</p>
            </div>
            <div className='flex items-center gap-4 text-[9px] font-black uppercase tracking-tighter'>
              <div className='flex items-center gap-1.5'><span className='w-2 h-2 bg-[#13786E] rounded-full'></span> Sales</div>
              <div className='flex items-center gap-1.5'><span className='w-2 h-2 bg-teal-300 rounded-full'></span> Profit</div>
            </div>
          </div>
          
          <div className='h-[350px] w-full'>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#13786E" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#13786E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#13786E" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" stroke="#5EEAD4" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audit / Summary Box */}
        <div className='bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center text-center'>
            <div className='bg-teal-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#13786E] shadow-inner'>
               <Activity size={30} />
            </div>
            <h4 className='text-xl font-black text-gray-800 leading-tight uppercase tracking-tighter'>Audit Summary</h4>
            <p className='text-xs text-gray-400 font-bold mt-4 leading-relaxed'>
               In {selectedMonth}, your revenue has shown consistent stability. Keep monitoring expenses to maintain the net profit margin.
            </p>
            <div className='mt-8 pt-8 border-t border-gray-50 flex flex-col gap-3'>
                <button className='text-[10px] font-black text-[#13786E] uppercase tracking-widest hover:underline'>
                    Export CSV Report
                </button>
                <button className='text-[10px] font-black text-gray-400 uppercase tracking-widest hover:underline'>
                    Print Summary
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

// Internal StatCard Component
const StatCard = ({ title, amount, percentage, isUp, icon }) => (
  <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all'>
    <div className='flex items-center justify-between mb-4'>
      <div className='bg-teal-50 p-4 rounded-2xl text-[#13786E] shadow-inner'>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-[9px] font-black uppercase ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
        {isUp ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
        {percentage}
      </div>
    </div>
    <h3 className='text-gray-400 text-[10px] font-black uppercase tracking-widest'>{title}</h3>
    <p className='text-2xl font-black text-gray-800 mt-1 tracking-tighter'>{amount}</p>
  </div>
);

export default Revenue;