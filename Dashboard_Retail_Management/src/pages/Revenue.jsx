import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Calendar, Loader
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import axiosInstance from '../lib/axios';

const Revenue = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('This Year');

  // --- FETCH ANALYTICS FROM BACKEND ---
  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/revenue/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching analytics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) return (
    <div className="flex-1 ml-64 h-screen flex items-center justify-center">
      <Loader className="animate-spin text-[#13786E]" size={40} />
    </div>
  );

  return (
    <div className='flex-1 ml-64 min-h-screen mt-14 bg-[#F8FAFC] p-8 text-left'>
      
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 tracking-tighter uppercase italic'>Revenue Analytics</h1>
          <p className='text-gray-400 text-xs font-bold tracking-widest uppercase'>Financial Performance Overview</p>
        </div>
        
        <div className='bg-[#13786E] text-white px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg font-bold text-xs'>
          <Calendar size={16} />
          <select 
            className='bg-transparent outline-none cursor-pointer uppercase'
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="This Year">This Year</option>
            <option value="All Time">All Time</option>
          </select>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <StatCard 
          title="Total Revenue" 
          amount={`Rs. ${stats?.totalRevenue.toLocaleString()}`} 
          percentage="+12.5%" 
          isUp={true} 
          icon={<DollarSign size={24}/>} 
        />
        <StatCard 
          title="Avg. Order Value" 
          amount={`Rs. ${stats?.avgOrderValue}`} 
          percentage="-2.4%" 
          isUp={false} 
          icon={<TrendingUp size={24}/>} 
        />
        <StatCard 
          title="Net Profit" 
          amount={`Rs. ${stats?.netProfit.toLocaleString()}`} 
          percentage="+8.2%" 
          isUp={true} 
          icon={<DollarSign size={24}/>} 
        />
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        
        {/* Main Revenue Area Chart */}
        <div className='lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm'>
          <div className='flex items-center justify-between mb-8'>
            <h3 className='font-black text-gray-800 text-sm uppercase tracking-widest'>Revenue Growth</h3>
            <div className='flex items-center gap-4 text-[10px] font-black uppercase'>
              <div className='flex items-center gap-1.5'><span className='w-2 h-2 bg-[#13786E] rounded-full'></span> Revenue</div>
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
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#13786E" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" stroke="#5EEAD4" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small Weekly Breakdown (Static for now) */}
        <div className='bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center'>
            <div className='text-center'>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2'>Performance Note</p>
                <h4 className='text-lg font-bold text-gray-800 leading-tight'>Your Net Profit is 100% dependent on Expense Control.</h4>
                <div className='mt-8 p-6 bg-teal-50 rounded-3xl'>
                    <p className='text-xs text-[#13786E] font-bold'>Keep tracking your daily sales to see real-time growth.</p>
                </div>
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
      <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
        {isUp ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
        {percentage}
      </div>
    </div>
    <h3 className='text-gray-400 text-[10px] font-black uppercase tracking-widest'>{title}</h3>
    <p className='text-2xl font-black text-gray-800 mt-1 tracking-tighter'>{amount}</p>
  </div>
);

export default Revenue;