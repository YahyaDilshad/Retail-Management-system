import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Store, Key, MessageSquare, TrendingDown, TrendingUp,
  Crown, ShieldCheck, LogOut, Package, Grid2X2, Boxes, ReceiptCent,
  Users, Truck, Building, GitBranch, UserCheck, Lock, ScanLine,
  ShoppingCart, HandCoins
} from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const Sidebar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  // User ka data nikalna taake role pata chale
  const { data: authData } = useQuery({ queryKey: ["authUser"] });
  
  // Role Check: Pehle Backend se check karein, agar wahan nahi to LocalStorage (Store Login ke liye)
  const user = authData?.user || authData;
  const storeUser = JSON.parse(localStorage.getItem("activeStore"));
  const role = storeUser ? "store" : (user?.role === "admin" ? "admin" : "admin");

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (role === "admin") {
        await axiosInstance.post("/auth/logout");
      }
    },
    onSuccess: () => {
      localStorage.removeItem("activeStore");
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/admin/signUp");
    }
  });

  const isActive = (path) => location.pathname === path;

  // --- ADMIN LINKS ---
  const adminLinks = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, to: "/admin/dashboard" },
    { label: "Stores", icon: <Store size={20} />, to: "/admin/store" },
    { label: "Rent", icon: <Key size={20} />, to: "/admin/rent" },
    { label: "Messages", icon: <MessageSquare size={20} />, to: "/admin/messages" },
    { label: "Expense", icon: <TrendingDown size={20} />, to: "/admin/expense" },
    { label: "Revenue", icon: <TrendingUp size={20} />, to: "/admin/revenue" },
    { label: "Customer Status", icon: <Crown size={20} />, to: "/admin/customerstatus" },
  ];

  // --- STORE LINKS (Grouped for better look) ---
  const storeGroups = [
    {
      group: "Main",
      links: [
        { label: "Dashboard", icon: <LayoutDashboard size={18} />, to: "/admin/dashboard" },
        { label: "Billing", icon: <ReceiptCent size={18} />, to: "/admin/billing" },
        { label: "Scanner", icon: <ScanLine size={18} />, to: "/admin/scanner" },
      ]
    },
    {
      group: "Inventory",
      links: [
        { label: "Products", icon: <Package size={18} />, to: "/admin/products" },
        { label: "Categories", icon: <Grid2X2 size={18} />, to: "/admin/categories" },      ]
    },
    {
      group: "Sales & Orders",
      links: [
        { label: "Orders", icon: <ShoppingCart size={18} />, to: "/admin/orders" },
        { label: "Customers", icon: <Users size={18} />, to: "/admin/customers" },
        { label: "Debt / Udhaar", icon: <HandCoins size={18} />, to: "/admin/debt" },
      ]
    },
    {
      group: "Partners",
      links: [
        { label: "Whole Sellers", icon: <Truck size={18} />, to: "/admin/wholesalers" },
        { label: "Agencies", icon: <Building size={18} />, to: "/admin/agencies" },
        { label: "Branches", icon: <GitBranch size={18} />, to: "/admin/branches" },
      ]
    },
    {
      group: "Staff & Management",
      links: [
        { label: "Staff", icon: <UserCheck size={18} />, to: "/admin/staff" },
        { label: "Permissions", icon: <Lock size={18} />, to: "/admin/permissions" },
        { label: "Expense", icon: <TrendingDown size={18} />, to: "/admin/expense" },
        { label: "Revenue", icon: <TrendingUp size={18} />, to: "/admin/revenue" },
      ]
    }
  ];

  return (
    <aside className="w-64 h-screen bg-[#13786E] text-white fixed left-0 top-0 flex flex-col border-r border-teal-700 shadow-xl z-[999]">
      {/* Logo Section */}
      <div className="p-6 border-b border-teal-800">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Apexiums</h1>
            <p className="text-[10px] text-teal-300 tracking-widest uppercase italic">
              {role === "admin" ? "Admin Panel" : "Store Portal"}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar">
        {role === "admin" ? (
          // --- ADMIN VIEW ---
          <div className="space-y-1">
            {adminLinks.map((link) => (
              <SidebarLink key={link.to} link={link} active={isActive(link.to)} />
            ))}
          </div>
        ) : (
          // --- STORE VIEW ---
          storeGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              <h2 className="px-4 text-[10px] font-black text-teal-400 uppercase tracking-widest mb-2 opacity-70">
                {group.group}
              </h2>
              <div className="space-y-1">
                {group.links.map((link) => (
                  <SidebarLink key={link.to} link={link} active={isActive(link.to)} />
                ))}
              </div>
            </div>
          ))
        )}

        {/* Administrator Link (Always at bottom of list) */}
        <div className="mt-4 pt-4 border-t border-teal-800">
          <SidebarLink 
            link={{ label: "Administrator", icon: <ShieldCheck size={20} />, to: "/admin/settings" }} 
            active={isActive("/admin/settings")} 
          />
        </div>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-teal-800 bg-teal-900/20">
        <button
          onClick={() => logoutMutation.mutate()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-teal-100 hover:text-red-300 transition-all"
        >
          <LogOut size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">Log Out</span>
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </aside>
  );
};

// Sub-component for individual links
const SidebarLink = ({ link, active }) => (
  <Link
    to={link.to}
    className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group
      ${active ? "bg-white text-[#13786E] shadow-lg font-bold" : "hover:bg-white/10 text-teal-50"}`}
  >
    {active && <span className="absolute left-0 w-1.5 h-5 bg-[#13786E] rounded-r-full" />}
    <span className={`${active ? "text-[#13786E]" : "text-teal-300 group-hover:text-white"}`}>
      {link.icon}
    </span>
    <span className="text-sm">{link.label}</span>
  </Link>
);

export default Sidebar;