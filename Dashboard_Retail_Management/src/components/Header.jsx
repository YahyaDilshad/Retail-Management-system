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
    <header className="bg-[#F8FAFC] w-[80vw] ml-60">
      <div className="max-w-7xl mx-auto px-4 py-3  flex items-center justify-end">
        <div className="relative right-0 ">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 focus:outline-none"
          > <Bell className="text-2xl text-black cursor-pointer" />
          </button>

          {showMenu && (
            <div className="absolute z-99 overflow-y-auto transition-all ease-in duration-300 right-0 mt-2 w-100 h-70 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  <div className="border-b-2 border-gray-300 bg-[#F8FAFC] hover: mb-2 p-3 flex items-center justify-between">
                    <h1 className="text-xl text-gray-400 ">Notification</h1>
                    <p className="text-sm text-[#20B0A4] font-medium cursor-pointer ">Clear All</p>
                  </div>
              {notificationData.map((notification) => (
                <div key={notification.id} className=" px-4 py-2 text-sm border-b border-gray-300 text-gray-700 hover:bg-[#ebeff3]">
                  <h3 className="text-md mb-2">{notification.Title}</h3>
                  <p className="text-md mb-2" >{notification.Message}</p>
                  <p>{new Date(notification.createdAt).toDateString()}</p>
                </div>
              ))}
               <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/admin/profile");
                }}
                className="w-fit fixed  text-sm text-black hover:border-b hover:border-gray-300 cursor-pinter"
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
