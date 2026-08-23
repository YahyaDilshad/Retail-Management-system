import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Calendar, Loader, Activity
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import axiosInstance from '../lib/axios';

const Revenue = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH 30 DAYS ANALYTICS ---
  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Backend ko 30 days ka parameter bhej sakte hain agar API support karti hai
      const res = await axiosInstance.get("/revenue/stats?range=30days");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching 30 days analytics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) return (
    <div className="flex-1 ml-64 h-screen flex items-center justify-center bg-gray-50">
      <div className='flex flex-col items-center gap-3'>
        <Loader className="animate-spin text-[#13786E]" size={40} />
        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Calculating 30 Days Data...</p>
      </div>
    </div>
  );

  return (
    <div className='flex-1 ml-64 min-h-screen mt-14 bg-[#F8FAFC] p-8 text-left font-sans'>
      
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 tracking-tighter uppercase italic flex items-center gap-3'>
            <Activity className="text-[#13786E]" /> 30 Days Analytics
          </h1>
          <p className='text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1'>Financial performance for the last 30 days</p>
        </div>
        
        <div className='bg-white border border-gray-200 text-[#13786E] px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm font-black text-[10px] uppercase tracking-widest'>
          <Calendar size={16} />
          Last 30 Days Fixed
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
        <StatCard 
          title="Revenue (30D)" 
          amount={`Rs. ${stats?.totalRevenue.toLocaleString()}`} 
          percentage="+14.2%" 
          isUp={true} 
          icon={<DollarSign size={22}/>} 
        />
        <StatCard 
          title="Avg. Store Rent" 
          amount={`Rs. ${stats?.avgOrderValue}`} 
          percentage="Stable" 
          isUp={true} 
          icon={<TrendingUp size={22}/>} 
        />
        <StatCard 
          title="Net Profit (30D)" 
          amount={`Rs. ${stats?.netProfit.toLocaleString()}`} 
          percentage="+5.7%" 
          isUp={true} 
          icon={<DollarSign size={22}/>} 
        />
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        
        {/* Main 30-Day Trend Chart */}
        <div className='lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm'>
          <div className='flex items-center justify-between mb-10'>
            <div>
              <h3 className='font-black text-gray-800 text-sm uppercase tracking-widest'>30 Days Revenue Trend</h3>
              <p className='text-[10px] text-gray-400 font-bold uppercase mt-1'>Daily income visualization</p>
            </div>
            <div className='flex items-center gap-4 text-[9px] font-black uppercase tracking-tighter'>
              <div className='flex items-center gap-1.5'><span className='w-2 h-2 bg-[#13786E] rounded-full'></span> Sales</div>
              <div className='flex items-center gap-1.5'><span className='w-2 h-2 bg-teal-300 rounded-full'></span> Margin</div>
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
                {/* Updated XAxis to show days */}
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

        {/* Info Box */}
        <div className='bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center text-center'>
            <div className='bg-teal-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#13786E] shadow-inner'>
               <Activity size={30} />
            </div>
            <h4 className='text-xl font-black text-gray-800 leading-tight uppercase tracking-tighter'>Monthly Audit</h4>
            <p className='text-xs text-gray-400 font-bold mt-4 leading-relaxed'>
               Based on the last 30 days, your business is performing optimally. Ensure that expenses do not exceed 40% of the total revenue.
            </p>
            <div className='mt-8 pt-8 border-t border-gray-50'>
                <button className='text-[10px] font-black text-[#13786E] uppercase tracking-widest hover:underline'>
                    Download 30D Report PDF
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

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