import React from 'react'
import { 
  LayoutDashboard, 
  Store, 
  Key, 
  MessageSquare, 
  TrendingDown, 
  TrendingUp, 
  Crown,
  ArrowRight,
  Activity
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {

  // Stats Data based on your Sidebar items
  const stats = [
    {
      label: "Total Stores",
      count: "0",
      icon: <Store size={28} />,
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
      count: "Rs. $54,230.00",
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
    <div className='flex-1 ml-64 min-h-screen bg-[#F8FAFC] p-10 mt-14'>
      
      {/* Header Section */}
      <div className='mb-10'>
        <h1 className='text-3xl font-bold text-gray-800 flex items-center gap-3'>
          <LayoutDashboard className="text-[#13786E]" /> Overview Dashboard
        </h1>
        <p className='text-gray-500 mt-1 text-lg'>
          Manage your business growth and retail operations from one place.
        </p>
      </div>

      {/* Stats Cards Grid (3 columns on large screens) */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {stats.map((item, idx) => (
          <Link 
            key={idx} 
            to={item.to}
            className='group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col relative overflow-hidden'
          >
            {/* Background Decorative Circle */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${item.bgColor} opacity-20 group-hover:scale-150 transition-transform duration-500`} />

            {/* Top Row: Icon and Label */}
            <div className='flex items-start justify-between mb-6 relative z-10'>
              <div className={`${item.bgColor} p-4 rounded-2xl transition-transform group-hover:rotate-6`} style={{ color: item.color }}>
                {item.icon}
              </div>
              <div className='text-right'>
                <h3 className='text-gray-500 font-bold text-xs uppercase tracking-[2px] mb-1'>
                  {item.label}  
                </h3>
                <p className='text-2xl font-black text-gray-900'>
                  {item.count}
                </p>
              </div>
            </div>

            {/* Bottom Row: Action */}
            <div className='mt-auto pt-5 border-t border-gray-50 flex items-center justify-between relative z-10'>
              <div className='flex items-center gap-2 text-gray-400 text-xs font-medium italic'>
                <Activity size={14} className="text-[#13786E]" />
                {item.desc}
              </div>
              <div 
                className='flex items-center gap-1 font-bold text-sm transition-all duration-300' 
                style={{ color: item.color }}
              >
                View Details <ArrowRight size={16} className='group-hover:translate-x-2 transition-transform' />
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}

export default Dashboard;