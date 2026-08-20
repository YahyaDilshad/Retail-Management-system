  import React from "react";
  import { Link, useLocation, useNavigate } from "react-router-dom";
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
    Boxes,
    Settings
  } from "lucide-react";
  import { useMutation, useQueryClient } from "@tanstack/react-query";
  import axiosInstance from "../lib/axios";
  import { toast } from "react-toastify";

  const Sidebar = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const location = useLocation();

    const logoutMutation = useMutation({
      mutationFn: async () => {
        const currentToken = localStorage.getItem("fcmToken");
        await axiosInstance.post("/auth/logout", { token: currentToken });
      },
      onSuccess: () => {
        localStorage.removeItem("authUser");
        localStorage.removeItem("fcmToken");
        queryClient.clear();
        toast.success("Logged out successfully");
        navigate("/login");
      },
      onError: () => {
        toast.error("Logout failed. Please try again.");
      }
    });

    const isActive = (path) => location.pathname === path;

    // Grouped Links for better Organization
    const menuGroups = [
      {
        group: "Main",
        links: [
          { label: "Dashboard", icon: <LayoutDashboard size={20} />, to: "/admin/dashboard" },
          { label: "Revenue", icon: <DollarSign size={20} />, to: "/admin/revenue" },
        ]
      },
      {
        group: "Inventory & Sales",
        links: [
          { label: "Products", icon: <Package2 size={20} />, to: "/admin/products" },
          { label: "Categories", icon: <Tags size={20} />, to: "/admin/categories" },
          { label: "Stock Mgmt", icon: <Boxes size={20} />, to: "/admin/stock" },
          { label: "Scanner", icon: <ScanLine size={20} />, to: "/admin/scanner" },
          { label: "Billing", icon: <ReceiptCent size={20} />, to: "/admin/billing" },
        ]
      },
      {
        group: "Staff & Users",
        links: [
          { label: "Staff", icon: <Users size={20} />, to: "/admin/staff" },
          { label: "Attendance", icon: <Building2 size={20} />, to: "/admin/staff-attendence" },
          { label: "Clients", icon: <UserCheck size={20} />, to: "/admin/client-review" },
          { label: "All Users", icon: <User size={20} />, to: "/admin/all-users" },
        ]
      },
      {
        group: "System",
        links: [
          { label: "About Us", icon: <Info size={20} />, to: "/admin/about" },
        ]
      }
    ];

    return (
      <aside className="w-64 h-screen bg-[#13786E] text-white fixed left-0 top-0 flex flex-col border-r border-teal-700 shadow-xl z-[999]">
        
        {/* Logo Section */}
        <div className="p-6">
          <Link to='/admin' className="flex items-center gap-3 group">
            <div className="bg-white/20 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <LayoutDashboard size={28} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Apexiums</h1>
              <p className="text-[10px] text-teal-200 tracking-widest uppercase">Management</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links with Custom Scrollbar */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              <h2 className="px-4 text-[11px] font-semibold text-teal-300 uppercase tracking-wider mb-2">
                {group.group}
              </h2>
              <div className="space-y-1">
                {group.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group
                      ${isActive(link.to) 
                        ? "bg-white text-[#13786E] shadow-md font-semibold" 
                        : "hover:bg-white/10 text-teal-50"
                      }`}
                  >
                    {/* Active Indicator Line */}
                    {isActive(link.to) && (
                      <span className="absolute left-0 w-1 h-6 bg-[#13786E] rounded-r-full" />
                    )}
                    
                    <span className={`${isActive(link.to) ? "text-[#13786E]" : "text-teal-300 group-hover:text-white"}`}>
                      {link.icon}
                    </span>
                    <span className="text-sm">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout / User Profile Section */}
        <div className="p-4 border-t border-teal-700 bg-teal-800/30">
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 text-teal-100 group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-medium">
              {logoutMutation.isPending ? "Logging out..." : "Log Out"}
            </span>
          </button>
        </div>

        {/* Custom CSS logic for Scrollbar (Add to your global CSS if needed) */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
          }
        `}</style>
      </aside>
    );
  };

  export default Sidebar;