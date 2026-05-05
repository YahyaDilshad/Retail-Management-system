import React, { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import dashboardImg from "../assets/signUpdahboard2.png";
import dashboardImg2 from "../assets/signupdashboardImages.png";
import logoSvg from "../assets/react.svg";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Home } from "lucide-react";
import { QueryClient, QueryClientProvider, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios.js";

const SignUp = () => {
  const navigate = useNavigate();
  
  const queryclient =  useQueryClient()
  const loginResult = useMutation({
     mutationFn :async (formdata)=>{
        const res  = await axiosInstance.post('/auth/login' , formdata)
        return res.data
     },onSuccess : ()=>{
      queryclient.invalidateQueries(["authUser"])
     }
  })
  
  const [Showpassword, setShowpassword] = useState(false);
  
  const [Formdata, setFormdata] = useState({
    identifier : "",
    password: ""
  });

  // ✅ Validation
  const formvalidate = () => {
    if (!Formdata.identifier.trim()) {
      toast.error("Email Or username is required");
      return false;
    }
    if (!Formdata.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (Formdata.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    
    return true;
  };

  // ✅ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formvalidate()) return;

    const formdata = {
      identifier: Formdata.identifier,
      password: Formdata.password,
    };

    try {
      const userData = await loginResult.mutateAsync(formdata);
        toast.success("Login successful!");
        navigate('/admin')
    }
     catch (error) {
      toast.error("Login failed");
      console.error("Login error:", error);
    }
  };


  return (
    <div className="w-full min-h-screen bg-[#E6F2F3]">
  
      <div className="w-100 h-fit overflow-hidden md:w-1/3 absolute rounded-2xl left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%]   flex item-center flex-col justify-center bg-white">
        <div className="w-full h-60 flex flex-col items-center justify-center gap-3 mb-6 bg-[#20B0A4]">
          
          <div className="flex items-center justify-center flex-col ">
            <Home size={10} className="w-15 h-15 p-3 mb-5  rounded-full   bg-[#ffffff42] text-white" />
            <div className="text-white text-2xl mb-2 font-semibold">Apexiums Retail Management</div>
            <p className="text-white mb-6">
              Create your account to get started with us
            </p>
        </div>
        </div>

        {/* ✅ Signup Form */}
        <form onSubmit={handleLogin} className="space-y-2 px-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Username / Email</label>
           <input
            value={Formdata.identifier}
            type="text"
            placeholder="Email or Username"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#  20B0A4]"
            onChange={(e) =>
              setFormdata({ ...Formdata, identifier: e.target.value })
            }
          /> </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
           <input
            value={Formdata.password}
            type={Showpassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#20B0A4]"
            
            onChange={(e) =>
              setFormdata({ ...Formdata, password: e.target.value })
            }
          />
        
          </div>

          <div className="flex items-center justify-between">
            <label
              htmlFor="Showpassword"
              className="flex items-center text-sm text-gray-600"
            >
              <input
                checked={Showpassword}
                onChange={() => setShowpassword(!Showpassword)}
                type="checkbox"
                className="mr-2"
              />
              Show password
            </label>
            
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full p-3 mt-4 text-white bg-[#20B0A4] rounded-md"
          >
            Login Account
          </button>
        </form>

        <p className="text-sm ml-5 mb-10 text-gray-600 mt-6">
          You don't have an account?{" "}
          <Link
            to="/admin/signUp"
            className="text-[#20B0A4] font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
