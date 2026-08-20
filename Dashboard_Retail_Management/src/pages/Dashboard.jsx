import { useQueries } from '@tanstack/react-query'
import React from 'react'
import axiosInstance from '../lib/axios'
import { 
  Grid2X2, 
  Package, 
  TrendingUp, 
  Users, 
  ArrowRight 
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {

  const result = useQueries({
    queries: [
      {
        queryKey: ["totalProducts"],
        queryFn: async () => {
          const res = await axiosInstance.get("/products")
          return res.data?.data || []
        },
      },
      {
        queryKey: ["Total Categories"],
        queryFn: async () => {
          const res = await axiosInstance.get("/categories")
          return res.data?.categories || []
        },
      },
      {
        queryKey: ["TotalStaff"],
        queryFn: async () => {
          const res = await axiosInstance.get('/staff')
          return res.data?.data || []
        }
      }
    ]
  })

  // Data mapping for cleaner UI
  const stats = [
    {
      label: "Total Products",
      count: result[0]?.data?.length || 0,
      icon: <Package size={28} />,
      to: "/admin/products",
      color: "#13786E",
      bgColor: "bg-[#ECF8F8]"
    },
    {
      label: "Total Categories",
      count: result[1]?.data?.length || 0,
      icon: <Grid2X2 size={28} />,
      to: "/admin/categories",
      color: "#3B82F6", // Blue touch for distinction
      bgColor: "bg-blue-50"
    },
    {
      label: "Total Staff",
      count: result[2]?.data?.length || 0,
      icon: <Users size={28} />,
      to: "/admin/staff",
      color: "#8B5CF6", // Purple touch
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className='flex-1 ml-64 min-h-screen bg-[#F8FAFC] p-10'>
      
      {/* Header Section */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>Overview</h1>
        <p className='text-gray-500'>Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {stats.map((item, idx) => (
          <Link 
            key={idx} 
            to={item.to}
            className='group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col'
          >
            {/* Top Row: Icon and Label */}
            <div className='flex items-start justify-between mb-4'>
              <div>
                <h3 className='text-gray-400 font-semibold text-sm uppercase tracking-wider'>
                  {item.label}
                </h3>
                <p className='text-4xl font-bold text-gray-800 mt-1'>
                  {item.count}
                </p>
              </div>
              <div className={`${item.bgColor} p-4 rounded-xl transition-transform group-hover:scale-110`} style={{ color: item.color }}>
                {item.icon}
              </div>
            </div>

            {/* Bottom Row: Trend and Action */}
            <div className='mt-auto pt-6 border-t border-gray-50 flex items-center justify-between'>
              <div className='flex items-center gap-2 text-[#13786E] text-sm font-medium'>
                <TrendingUp size={16} />
                <span>Live Records</span>
              </div>
              <div className='flex items-center gap-1 text-gray-400 group-hover:text-[#13786E] transition-colors text-sm font-bold'>
                Manage <ArrowRight size={14} className='group-hover:translate-x-1 transition-transform' />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dashboard;