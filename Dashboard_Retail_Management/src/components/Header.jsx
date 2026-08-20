import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell, User, Settings, LogOut, ChevronDown, CheckCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

const Header = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Refs to close dropdowns when clicking outside
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const { data: notificationData = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notification");
      return res.data?.data || [];
    },
    staleTime: 1000 * 60 * 5 
  });

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 z-[99] shadow-sm flex items-center justify-between px-8">
      
      {/* Left Side: Breadcrumbs or Welcome Message */}
      <div className="hidden md:block">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">
          Retail System / <span className="text-gray-800">Admin Dashboard</span>
        </h2>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center gap-6">
        
        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-full transition-all duration-200 relative ${
              showNotifications ? "bg-teal-50 text-[#13786E]" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Bell size={22} />
            {notificationData.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 bg-[#F8FAFC] border-b border-gray-100 flex items-center justify-between">
                <span className="font-bold text-gray-800">Notifications</span>
                <button className="text-[10px] uppercase font-bold text-[#13786E] hover:underline">Mark all as read</button>
              </div>

              <div className="max-h-72 overflow-y-auto custom-scrollbar">
                {notificationData.length > 0 ? (
                  notificationData.map((notif, idx) => (
                    <div key={idx} className="px-4 py-3 border-b border-gray-50 hover:bg-teal-50/30 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#13786E]">{notif.Title}</h4>
                        <span className="text-[10px] text-gray-400 font-medium italic">{new Date(notif.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{notif.Message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-gray-400 flex flex-col items-center">
                    <CheckCheck size={40} className="mb-2 opacity-20" />
                    <p className="text-sm italic">All caught up!</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => { setShowNotifications(false); navigate("/admin/notifications"); }}
                className="w-full py-3 text-center text-sm font-bold text-[#13786E] bg-gray-50 hover:bg-gray-100 border-t border-gray-100 transition-colors"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="w-[1px] h-8 bg-gray-200 mx-1"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-lg bg-[#13786E] flex items-center justify-center text-white font-bold shadow-md shadow-teal-900/20">
              A
            </div>
            <div className="hidden lg:block text-left leading-none">
              <p className="text-sm font-bold text-gray-800">Admin Account</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mt-1">Super Admin</p>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${showProfileMenu ? "rotate-180" : ""}`} />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200">
              <Link to="/admin/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-teal-50 hover:text-[#13786E] transition-colors">
                <User size={16} /> My Profile
              </Link>
              <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-teal-50 hover:text-[#13786E] transition-colors">
                <Settings size={16} /> Settings
              </Link>
              <div className="h-[1px] bg-gray-100 my-2 mx-4"></div>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <LogOut size={16} /> Log Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;