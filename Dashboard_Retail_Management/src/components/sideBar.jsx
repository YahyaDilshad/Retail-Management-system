import React from "react";
import { useState } from "react";
import { Link, Routes,Route, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  User,
  TrendingUp,
  Receipt,
  Package2,
  Tags,
  ScanLine,
  ReceiptCent,
  Users,
  Bell,
  Building2,
  UserCheck,
  DollarSign,
  CalendarCheck,
  Info,
  Boxes

} from "lucide-react";
import Orders from "../pages/Orders";

const Sidebar = () => {
 
  const handleAllusers = ()=>{

  }
  return (
    <aside className="w-60 bg-[#0e6d65] text-white h-screen flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <Link to='/admin' className="flex items-center justify-center gap-2 px-5 mt-5">
        <div className="bg-[#ffffff4d] p-2 rounded-lg">
          <LayoutDashboard   size={24} />
        </div>
  <h1 className="text-md  text-white">Apexiums Retail Management</h1>
      </Link>

      {/* Menu Links */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        
          <Link
           className={`flex items-center  text-white hover:bg-[#ffffff4d] gap-2  px-4 py-2 rounded-lg transition-all`}
           to="/admin/dashboard"
          >
            <span><BarChart3/></span>
            <span>Dashboard</span>
          </Link>
        
          <Link
           className={`flex items-center  text-white hover:bg-[#ffffff4d]    gap-3 px-4 py-2 rounded-lg transition-all`}
           to="/admin/products"
          >   
            <span><Package2/></span>
            <span>Products</span>
          </Link>
        
          <Link
           className={`flex items-center  text-white hover:bg-[#ffffff4d]    gap-3 px-4 py-2 rounded-lg transition-all`}
           to="/admin/categories"
          >
            <span><Tags/></span>
            <span>Categories</span>
          </Link>
        
          <Link
           className={`flex items-center  text-white hover:bg-[#ffffff4d]    gap-3 px-4 py-2 rounded-lg transition-all`}
           to="/admin/Scanner"  
          >
            <span><ScanLine/></span>
            <span>Scanner</span>
          </Link>
        
          <Link
           className={`flex items-center  text-white hover:bg-[#ffffff4d]    gap-3 px-4 py-2 rounded-lg transition-all`}
           to='/admin/billing'
          >
            <span><ReceiptCent/></span>
            <span>Billing</span>
          </Link>
        
          <Link
           className={`flex items-center text-white hover:bg-[#ffffff4d]  gap-3 px-4 py-2 rounded-lg transition-all`}
           to="/admin/stock-management"
          >
            <span><Boxes/></span>
            <span>Stock Management</span>
          </Link>
        
          <Link
           className={`flex items-center text-white hover:bg-[#ffffff4d]  gap-3 px-4 py-2 rounded-lg transition-all`}
           to='/admin/staff'
          > 
            <span><Users/></span>
            <span>Staff</span>
          </Link>
          <Link
           className={`flex items-center text-white hover:bg-[#ffffff4d]  gap-3 px-4 py-2 rounded-lg transition-all`}
           to='/admin/notification'
          > 
            <span><Bell/></span>
            <span>Notifications</span>
          </Link>
          <Link
           className={`flex items-center text-white hover:bg-[#ffffff4d]  gap-3 px-4 py-2 rounded-lg transition-all`}
           to='/admin/agencies'
          > 
            <span><Building2/></span>
            <span>Agencies</span>
          </Link>
          <Link
           className={`flex items-center text-white hover:bg-[#ffffff4d]  gap-3 px-4 py-2 rounded-lg transition-all`}
           to='/admin/Clients'
          > 
            <span><UserCheck/></span>
            <span>Clients</span>
          </Link>
          <Link
           className={`flex items-center text-white hover:bg-[#ffffff4d]  gap-3 px-4 py-2 rounded-lg transition-all`}
           to='/admin/Revenue'
          > 
            <span><DollarSign/></span>
            <span>Revenue</span>
          </Link>
          <Link
           className={`flex items-center text-white hover:bg-[#ffffff4d]  gap-3 px-4 py-2 rounded-lg transition-all`}
           to='/admin/staff-attendance'
          > 
            <span><CalendarCheck/></span>
            <span>Staf Attendance</span>
          </Link>
          <Link
           className={`flex items-center text-white hover:bg-[#ffffff4d]  gap-3 px-4 py-2 rounded-lg transition-all`}
           to='/admin/about-us'
          > 
            <span><Info/></span>
            <span>About Us</span>
          </Link>
        
          <Link
          onClick={handleAllusers}
           className={`flex items-center text-white hover:bg-[#ffffff4d] gap-3 px-4 py-2 rounded-lg transition-all`}
           to='/admin/all-users'
          >
            <span><User /></span>
            <span>All Users</span>
          </Link>
    
      </nav>

      {/* Logout Button */}
      <div className=" h-13 border-t border-white">
        <button className="flex items-center gap-3 w-full  px-4 py-2 text-white hover:bg-[#ffffff4d]  transition-all">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
