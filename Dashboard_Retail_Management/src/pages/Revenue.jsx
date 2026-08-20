import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Download,
  Filter
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';

// Mock Data - Inhe aap API se replace kar sakte hain
const monthlyData = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 2000, profit: 9800 },
  { name: 'Apr', revenue: 2780, profit: 3908 },
  { name: 'May', revenue: 1890, profit: 4800 },
  { name: 'Jun', revenue: 2390, profit: 3800 },
  { name: 'Jul', revenue: 3490, profit: 4300 },
];

const dailyData = [
  { day: 'Mon', sales: 400 },
  { day: 'Tue', sales: 300 },
  { day: 'Wed', sales: 500 },
  { day: 'Thu', sales: 280 },
  { day: 'Fri', sales: 590 },
  { day: 'Sat', sales: 800 },
  { day: 'Sun', sales: 700 },
];

const Revenue = () => {
  const [timeRange, setTimeRange] = useState('Last 7 Days');

  return (
    <div className='flex-1 ml-64 min-h-[90%] mt-14 bg-[#F8FAFC] p-8'>
      
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>Revenue Analytics</h1>
          <p className='text-gray-500'>Track your store's financial performance</p>
        </div>
        
        <div className='flex items-center gap-3'>
          
          <div className='bg-[#13786E] text-white px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-900/10'>
            <Calendar size={18} />
            <select 
              className='bg-transparent outline-none text-sm font-semibold cursor-pointer'
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <StatCard 
          title="Total Revenue" 
          amount="$54,230.00" 
          percentage="+12.5%" 
          isUp={true} 
          icon={<DollarSign size={24}/>} 
        />
        <StatCard 
          title="Avg. Order Value" 
          amount="$1,240.00" 
          percentage="-2.4%" 
          isUp={false} 
          icon={<TrendingUp size={24}/>} 
        />
        <StatCard 
          title="Net Profit" 
          amount="$18,400.00" 
          percentage="+8.2%" 
          isUp={true} 
          icon={<DollarSign size={24}/>} 
        />
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        
        {/* Main Revenue Area Chart */}
        <div className='lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm'>
          <div className='flex items-center justify-between mb-8'>
            <h3 className='font-bold text-gray-800 text-lg'>Revenue Growth</h3>
            <div className='flex items-center gap-4 text-xs font-semibold'>
              <div className='flex items-center gap-1.5'><span className='w-3 h-3 bg-[#13786E] rounded-full'></span> Revenue</div>
              <div className='flex items-center gap-1.5'><span className='w-3 h-3 bg-teal-200 rounded-full'></span> Profit</div>
            </div>
          </div>
          
          <div className='h-[350px] w-full'>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#13786E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#13786E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#13786E" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" stroke="#5EEAD4" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Sales Bar Chart */}
        <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm'>
          <h3 className='font-bold text-gray-800 text-lg mb-8'>Weekly Sales</h3>
          <div className='h-[350px] w-full'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '12px' }} />
                <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                  {dailyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#13786E' : '#CCF2F0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className='text-center text-sm text-gray-400 mt-4 italic font-medium'>Saturday has the highest peak</p>
        </div>

      </div>
    </div>
  );
};

// Internal StatCard Component
const StatCard = ({ title, amount, percentage, isUp, icon }) => (
  <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
    <div className='flex items-center justify-between mb-4'>
      <div className='bg-teal-50 p-3 rounded-xl text-[#13786E]'>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
        {isUp ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
        {percentage}
      </div>
    </div>
    <h3 className='text-gray-500 text-sm font-medium'>{title}</h3>
    <p className='text-2xl font-bold text-gray-800 mt-1'>{amount}</p>
  </div>
);

export default Revenue;