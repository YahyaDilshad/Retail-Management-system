import React from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // useNavigate add kiya
import {
  LayoutDashboard,
  BarChart3,
  LogOut,
  User,
  Package2,
  Tags,
  ScanLine,
  ReceiptCent,
  Users,
  Building2,
  UserCheck,
  DollarSign,
  Info,
  Boxes
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const Sidebar = () => {
  const navigate = useNavigate(); // Redirect karne ke liye hook
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // 1. LocalStorage se token nikaalein taake backend se delete kar sakein
      // Agar aap token ko alag save karte hain to wahan se nikalyein
      const currentToken = localStorage.getItem("fcmToken"); 

      // 2. Backend ko logout request bhejein aur token bhi pass karein
      await axiosInstance.post("/auth/logout", { token: currentToken });
    },
    onSuccess: () => {
      // 3. Clear all auth details from frontend
      localStorage.removeItem("authUser");
      localStorage.removeItem("fcmToken"); // Agar token save kiya tha
      
      // React Query ka cache clear karein taake purana data leak na ho
      queryClient.clear();

      toast.success("User Logout Successfully!");
      
      // 4. Login page par bhejein
      navigate("/login"); 
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  });

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navelinks = [
    { label: "Dashboard", icon: <BarChart3/>, to: "/admin/dashboard"},
    { label: "Products", icon: <Package2 />, to: "/admin/products"},
    { label: "Categories", icon: <Tags/>, to: "/admin/categories"},
    { label: "Scanner", icon: <ScanLine/>, to: "/admin/scanner"},
    { label: "Billing", icon: <ReceiptCent/>, to: "/admin/billing"},
    { label: "Stock Management", icon: <Boxes/>, to: "/admin/stock"},
    { label: "Staff", icon: <Users/>, to: "/admin/staff"},
    { label: "Clients", icon: <UserCheck/>, to: "/admin/client-review"},
    { label: "Revenue", icon: <DollarSign/>, to: "/admin/revenue"},
    { label: "Staff Attendence", icon: <Building2/>, to: "/admin/staff-attendence"},
    { label: "About Us", icon: <Info/>, to: "/admin/about"},
    { label: "All User", icon: <User />, to: "/admin/all-users"},
  ];

  const handleLogout = () => {
    // Mutation trigger karein
    logoutMutation.mutate();
  };

  return (
    <aside className="w-61 overflow-y-auto z-999 bg-[#13786E] text-[#b9b9b9] lg:h-screen flex flex-col border-r-1 border-[#D1D5DB] fixed left-0 top-0">
      {/* Logo Section */}
      <Link to='/admin' className="flex items-center justify-center gap-2 px-5 mt-5">
        <div className="bg-[#ffffff52] text-white p-2 rounded-lg">
          <LayoutDashboard size={24} />
        </div>
        <h1 className="text-10 text-white">Apexiums Retail Management</h1>
      </Link>

      {/* Menu Links */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navelinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all hover:bg-white hover:text-[#13786E] ${
              isActive(link.to) ? "bg-white text-[#13786E]" : "text-white"
            }`}
          >
            <span>{link.icon}</span>
            <span className="text-[1.2vw] font-bold">{link.label}</span>
          </Link>
        ))}
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="w-full flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all hover:bg-white hover:text-[#13786E] text-white disabled:opacity-50"
        >
          <span><LogOut/></span>
          <span className="text-[15px] font-bold">
            {logoutMutation.isPending ? "Logging out..." : "Log Out"}
          </span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
