import React from 'react'
import { 
  LayoutDashboard, 
  Store, 
  Key, 
  TrendingUp, 
  Crown,
  Activity
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {

  const stats = [
    {
      label: "Total Stores",
      count: "0",
      icon: <Store size={28} />, // Size adjusted for smaller cards
      to: "/admin/store",
      color: "#13786E",
      bgColor: "bg-teal-50",
      desc: "Active Outlets"
    },
    {
      label: "Active Rent",
      count: "Rs. 450k",
      icon: <Key size={28} />, 
      to: "/admin/rent",
      color: "#3B82F6", 
      bgColor: "bg-blue-50",
      desc: "Monthly Collection"
    },
    {
      label: "Total Revenue",
      count: "Rs. 54,230.00",
      icon: <TrendingUp size={28} />, 
      to: "/admin/revenue",
      color: "#10B981", 
      bgColor: "bg-emerald-50",
      desc: "Earnings"
    },
    {
      label: "Platinum Customers",
      count: "158",
      icon: <Crown size={28} />, 
      to: "/admin/platinum-customers",
      color: "#8B5CF6", 
      bgColor: "bg-purple-50",
      desc: "VIP Members"
    }
  ];

  return (
    <div className='flex-1 ml-64 min-h-screen bg-[#F8FAFC] p-8 mt-14'>
      
      {/* Header Section */}
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
          <LayoutDashboard size={24} className="text-[#13786E]" /> Overview
        </h1>
        <p className='text-gray-500 text-sm'>
          Manage your business retail operations.
        </p>
      </div>

      {/* Stats Cards Grid - Changed to 4 columns for less width */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5'>
        {stats.map((item, idx) => (
          <Link 
            key={idx} 
            to={item.to}
            className='group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col relative'
          >
            {/* Top Row: Icon on Left, Text on Right */}
            <div className='flex items-center gap-4 mb-3'>
              {/* Compact Icon Container */}
              <div className={`${item.bgColor} p-3 rounded-xl transition-all duration-300 group-hover:scale-105`} style={{ color: item.color }}>
                {item.icon}
              </div>
              
              <div className='overflow-hidden'>
                <h3 className='text-gray-400 font-bold text-[10px] uppercase tracking-wider truncate'>
                  {item.label}  
                </h3>
                {/* Font Weight changed to Semibold/Bold (Darker) */}
                <p className='text-lg font-bold text-gray-800 truncate'>
                  {item.count}
                </p>
              </div>
            </div>

            {/* Bottom Row */}
            <div className='mt-auto pt-3 border-t border-gray-50 flex items-center justify-between'>
              <div className='flex items-center gap-1.5 text-gray-400 text-[10px] font-medium uppercase'>
                <Activity size={12} className="text-[#13786E]" />
                {item.desc}
              </div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}

export default Dashboard;