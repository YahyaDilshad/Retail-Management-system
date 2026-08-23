import React, { useState } from 'react'
import { 
  LayoutDashboard, Store, Key, TrendingUp, Crown, 
  Activity, Calendar, ArrowUpRight, ArrowDownRight 
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts'

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('30days');

  // --- Mock Data for 30 Days Trend ---
  const chartData = [
    { day: '01', rev: 4000 }, { day: '05', rev: 3000 }, { day: '10', rev: 5000 },
    { day: '15', rev: 4500 }, { day: '20', rev: 6000 }, { day: '25', rev: 5500 },
    { day: '30', rev: 8000 },
  ];

  const stats = [
    {
      label: "Total Stores",
      count: "12",
      icon: <Store size={24} />,
      to: "/admin/store",
      color: "#13786E",
      bgColor: "bg-teal-50",
      desc: "Live Outlets"
    },
    {
      label: "Monthly Rent",
      count: "Rs. 450k",
      icon: <Key size={24} />, 
      to: "/admin/rent",
      color: "#3B82F6", 
      bgColor: "bg-blue-50",
      desc: "Expected"
    },
    {
      label: "Total Revenue",
      count: "Rs. 890k",
      icon: <TrendingUp size={24} />, 
      to: "/admin/revenue",
      color: "#10B981", 
      bgColor: "bg-emerald-50",
      desc: "+12% Growth"
    },
    {
      label: "Defaulters",
      count: "04",
      icon: <Activity size={24} />, 
      to: "/admin/client-review",
      color: "#EF4444", 
      bgColor: "bg-red-50",
      desc: "Needs Attention"
    }
  ];

  return (
    <div className='flex-1 ml-64 min-h-screen bg-[#F8FAFC] p-8 mt-14 text-left font-sans'>
      
      {/* Header Section with Time Filter */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 tracking-tighter flex items-center gap-3'>
            <LayoutDashboard size={28} className="text-[#13786E]" /> Control Center
          </h1>
          <p className='text-gray-400 text-xs font-bold tracking-widest uppercase mt-1'>
            Business Performance & Analytics
          </p>
        </div>

        {/* TIME RANGE SELECTOR */}
        <div className='bg-white p-1 rounded-2xl border border-gray-200 flex shadow-sm'>
          {['30days'].map((range) => (
            <button
              key={range}
              onClick={() => setRange(range)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range ? "bg-[#13786E] text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
            >
              {range === '30days' ? 'Last 30 Days' : range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
        {stats.map((item, idx) => (
          <Link 
            key={idx} 
            to={item.to}
            className='group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative'
          >
            <div className='flex items-center gap-4 mb-4'>
              <div className={`${item.bgColor} p-4 rounded-2xl text-[${item.color}] transition-all group-hover:scale-110 shadow-inner`} style={{ color: item.color }}>
                {item.icon}
              </div>
              <div className='overflow-hidden'>
                <h3 className='text-gray-400 font-black text-[9px] uppercase tracking-widest truncate'>{item.label}</h3>
                <p className='text-xl font-black text-gray-800 truncate tracking-tighter'>{item.count}</p>
              </div>
            </div>
            <div className='mt-auto pt-4 border-t border-gray-50 flex items-center justify-between'>
              <span className='text-[9px] font-bold text-gray-400 uppercase'>{item.desc}</span>
              <ArrowUpRight size={14} className='text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity' />
            </div>
          </Link>
        ))}
      </div>

      {/* REVENUE ANALYTICS CHART (1 Month View) */}
      <div className='bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm'>
        <div className='flex items-center justify-between mb-10'>
          <div>
            <h3 className='text-sm font-black text-gray-800 uppercase tracking-widest'>Revenue Growth Trend</h3>
            <p className='text-[10px] text-gray-400 font-bold uppercase mt-1'>Visualizing data for the last 30 days</p>
          </div>
          <div className='flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-full'>
            <div className='w-2 h-2 bg-[#13786E] rounded-full animate-pulse'></div>
            <span className='text-[10px] font-black text-[#13786E] uppercase'>Live Update</span>
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
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} 
              />
              <Area 
                type="monotone" 
                dataKey="rev" 
                stroke="#13786E" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorRev)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}

export default Dashboard;