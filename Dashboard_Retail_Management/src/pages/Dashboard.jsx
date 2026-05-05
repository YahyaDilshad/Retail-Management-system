import { useQueries } from '@tanstack/react-query'
import React from 'react'
import axiosInstance from '../lib/axios'
import { Edit3, Grid2X2, LayoutDashboard, LayoutGrid, ListOrdered, Package, TrendingUp } from 'lucide-react'

const Dashboard = () => {

  const result  = useQueries({
    queries : [
      {
        queryKey : ["totalProducts"],
        queryFn : async()=>{
          const res =await axiosInstance.get("/products")
          return res.data?.data || []
        },
        staleTime : 1000 * 60 * 5
      },
      {
        queryKey : ["Total Categories"],
        queryFn : async()=>{
          const res = await axiosInstance.get("/categories")
          return res.data
        },
        staleTime : 1000 * 60 * 5
      },{
        queryKey : ["TotalStaff"],
        queryFn : async()=>{
          const res = await axiosInstance.get('/staff')
          return res.data || []
        }
      }

    ]
  })

  const TotalProductsArray = result[0]?.data || []
  const TotalCategories = result[1].data?.categories || []
  const totalStaffArray = result[2].data?.data || []
  console.log(totalStaffArray.length)
  return (
    <div className='w-[80%] absolute left-64  h-screen'>
      <h1 className='text-3xl mt-20 font-bold  ml-10'>Overview</h1>
      <div className='flex flex-wrap gap-5 p-10'>
         <div className={`w-75 p-5 bg-white border-gray-200 border-1 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer rounded-lg flex flex-col gap-1`}>          
          <div className='flex items-center flex-row-reverse justify-between'>
          <div className='p-2 w-fit rounded-md bg-[#ECF8F8]'>
          <Package className='w-12 h-12 text-[#4DC0B6]'/>
          </div>
          <h3 className='text-md text-gray-400 font-semibold '>Total Products</h3>
          </div>
          <p className='text-3xl font-bold'>{TotalProductsArray.length}</p>
          <div className='mt-4 flex items-center gap-1 text-[#4DC0B6] '>
            <TrendingUp className='text-[#4DC0B6]'/>
            <p>Manage Product Records</p>
          </div>
         </div>
         <div className={`w-75 p-5 bg-white border-gray-200 border-1 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer rounded-lg flex flex-col gap-1`}>          
          <div className='flex items-center flex-row-reverse justify-between'>
         <div className='p-2 w-fit rounded-md bg-[#ECF8F8]'>
          <Grid2X2 className='w-12 h-12 text-[#4DC0B6]'/>
          </div>
          <h3 className='text-md text-gray-400 font-semibold '>Total Categories</h3>
         </div>
          <p className='text-3xl font-bold'>{TotalCategories.length}</p>
          <div className='mt-4 flex items-center gap-1 text-[#4DC0B6] '>
            <TrendingUp className='text-[#4DC0B6]'/>
            <p>Manage Category Records</p>
          </div>
         </div>
         <div className={`w-75 p-5 bg-white border-gray-200 border-1 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer rounded-lg flex flex-col gap-1`}>          
          <div className='flex items-center flex-row-reverse justify-between'>
         <div className='p-2 w-fit rounded-md bg-[#ECF8F8]'>
          <Package className='w-12 h-12 text-[#4DC0B6]'/>
          </div>
          <h3 className='text-md text-gray-400 font-semibold '>Total Staff</h3>
         </div>
          <p className='text-3xl font-bold'>{totalStaffArray.length}</p>
          <div className='mt-4 flex items-center gap-1 text-[#4DC0B6] '>
            <TrendingUp className='text-[#4DC0B6]'/>
            <p>Manage Staff Records</p>
          </div>
         </div>
      </div>
    </div>
  )
}

export default Dashboard