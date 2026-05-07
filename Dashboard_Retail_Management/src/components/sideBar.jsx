import React from "react";
import { useState } from "react";
import { Link, Routes,Route, useLocation, Navigate, NavLink } from "react-router-dom";
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
 
  const location = useLocation();

  const isActive = (path) => location.pathname === path

  const navelinks = [
    { label : "Dashboard" , icon : <BarChart3/> , to : "/admin/dashboard"},
    { label : "Products" , icon : <Package2 /> , to : "/admin/products"},
    { label : "Categories" , icon : <Tags/> , to : "/admin/categories"},
    { label : "Scanner" , icon : <ScanLine/> , to : "/admin/scanner"},
    { label : "Billing" , icon : <ReceiptCent/> , to : "/admin/billing"},
    { label : "Stock Management" , icon : <Boxes/> , to : "/admin/stock-management"},
    { label : "Staff" , icon : <Users/> , to : "/admin/staff"},
    { label : "Clients" , icon : <UserCheck/> , to : "/admin/client"},
    { label : "Revenue" , icon : <DollarSign/> , to : "/admin/revenue"},
    { label : "Staff Attendence" , icon : <Building2/> , to : "/admin/staff-attendence"},
    { label : "About Us" , icon : <Info/> , to : "/admin/about"},
    { label : "All User" , icon : <User /> , to : "/admin/all-user"},
    { label : "Log Out" , icon : <LogOut/> , to : "/admin/signup"},
  ]
  const [Selectedfolder, setSelectedfolder] = useState(false)
  const handleOnclick = () =>{
    setSelectedfolder(!Selectedfolder)
  }
  return (
    <aside className="w-60 bg-[#0e6d65] text-white lg:h-screen flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <Link to='/admin' className="flex items-center justify-center gap-2 px-5 mt-5">
        <div className="bg-[#ffffff4d] p-2 rounded-lg">
          <LayoutDashboard   size={24} />
        </div>
        <h1 className="text-10  text-white">Apexiums Retail Management</h1>
      </Link>

      {/* Menu Links */}
     <nav className="flex-1 px-3 py-6 space-y-2">
        {navelinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all hover:bg-[#ffffff4d] ${
              isActive(link.to) ? "bg-[#ffffff4d] text-white" : "text-white"
            }`}
          >
            <span>{link.icon}</span>
            <span className="text-[15px] font-bold">{link.label}</span>
          </Link>
        ))}
      </nav>

    </aside>
  );
};

export default Sidebar;
