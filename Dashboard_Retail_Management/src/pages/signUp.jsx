import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, MessageCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [Showpassword, setShowpassword] = useState(false);
  const [Formdata, setFormdata] = useState({
    identifier: "",
    password: "",
    role: "admin",
  });

  const signUpResult = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post("/auth/signup", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["authUser"]);
      toast.success("Signup successful!");
      navigate("/admin/dashboard");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Signup failed. Try again.");
    }
  });

  const Formvalidate = () => {
    const { identifier, password } = Formdata;
    if (!identifier || !password) {
      toast.error("All fields are required");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Formvalidate()) return;
    signUpResult.mutate(Formdata);
  };

  return (
    // overflow-hidden handles laptop scrolling
    <div className="flex h-screen w-full overflow-hidden font-sans">
      
      {/* LEFT SIDE - Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#0e2a27] text-white p-16 flex-col justify-center items-center  relative">
        <div className="max-w-lg">
          <h1 className="text-4xl text-center font-serif font-bold leading-tight mb-6">
            Apexiums <span className="text-[#20b295]">Management Softwares</span>
          </h1>
          
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            We deals in all kind or management software. We are here to help you to make your business full digitilize. Be a part of us and expand your business globally.
          </p>

          <div className="space-y-4">
            <div className="inline-block bg-[#20b295]/20 border border-[#20b295] px-6 py-2 rounded-full text-[#20b295] font-bold text-xl uppercase tracking-wider">
              Book A free demo
            </div>
            
            <p className="text-2xl font-semibold flex gap-3">
              Contact us :- <span className="text-white">03405542097</span>
            </p>
          </div>

          <div className="mt-16">
            <p className="text-sm text-gray-400 tracking-widest uppercase">
              A project of Apexiums Technologies
            </p>
          </div>
        </div>

        {/* Floating WhatsApp Icon */}
        <a 
          href="https://wa.me/923405542097" 
          target="_blank" 
          rel="noreferrer"
          className="absolute bottom-10 right-10 bg-[#25D366] p-4 rounded-full shadow-2xl cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
        >
          <MessageCircle size={32} fill="white" className="text-[#25D366]" />
        </a>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          
          {/* Logo Icon */}
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-[#20b295] p-3 rounded-xl shadow-lg">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 leading-none">Apexiums Retail</h2>
              <p className="text-gray-500 text-sm">Management software</p>
            </div>
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mb-8">Access your software</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username / Email
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#20b295] focus:border-transparent outline-none transition-all"
                onChange={(e) => setFormdata({ ...Formdata, identifier: e.target.value })}
                value={Formdata.identifier}
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type={Showpassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#20b295] focus:border-transparent outline-none transition-all"
                onChange={(e) => setFormdata({ ...Formdata, password: e.target.value })}
                value={Formdata.password}
              />
              <button
                type="button"
                onClick={() => setShowpassword(!Showpassword)}
                className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600"
              >
                {Showpassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              disabled={signUpResult.isPending}
              type="submit"
              className="w-full bg-[#20b295] hover:bg-[#1a947c] text-white font-bold py-3 px-4 rounded-lg shadow-xl transform transition-all active:scale-95 disabled:opacity-70"
            >
              {signUpResult.isPending ? "Connecting..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;