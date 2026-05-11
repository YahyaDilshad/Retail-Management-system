import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useauthstore from "../store/authstore";
import logoSvg from "../assets/react.svg";
import { FaUserCircle } from "react-icons/fa";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

const Header = () => {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  
const result = useQuery({
  queryKey : ["notifications"],
  queryFn: async()=>{
    // Fetch notifications from backend
    const res = await axiosInstance.get("/notification")
    console.log(res.data.data)
    return res.data?.data || []
  },
  staleTime : 1000 * 60 * 5 
})

const notificationData = result.data || [];
  return (
    <header className="bg-[#F8FAFC] w-[83vw] ml-60">
      <div className="max-w-7xl mx-auto px-4 py-3  transition-all ease-in-out duration-300 flex items-center justify-end">
        <div className="relative right-0 ">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 focus:outline-none"
          > <Bell className="text-2xl text-black" />
          </button>

          {showMenu && (
            <div className="absolute z-99 overflow-y-auto right-0 mt-2 w-100 p-3 h-70 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
              {notificationData.map((notification) => (
                <div key={notification.id} className="rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                  <h3>{notification.Title}</h3>
                  <p>{notification.Message}</p>
                </div>
              ))}
               <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/admin/profile");
                }}
                className="w-fit fixed  text-sm text-black hover:border-b-1 hover:border-gray-300 cursor-pinter"
              >
                View All
              </button>
              
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
