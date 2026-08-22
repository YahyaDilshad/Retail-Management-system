import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Store, 
  Phone, 
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loginMode, setLoginMode] = useState("admin");
  const [Showpassword, setShowpassword] = useState(false);
  
  const [Formdata, setFormdata] = useState({
    identifier: "",
    password: "",
    storeName: "",
    phoneNumber: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post("/auth/signup", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["authUser"]);
      toast.success("Admin Login successful!");
      navigate("/admin/dashboard");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loginMode === "admin") {
      if (!Formdata.identifier || !Formdata.password) {
        return toast.error("Please enter Admin credentials");
      }
      loginMutation.mutate({ identifier: Formdata.identifier, password: Formdata.password });
    } else {
      if (!Formdata.storeName || !Formdata.phoneNumber) {
        return toast.error("Please enter Store details");
      }
      toast.success(`Welcome to ${Formdata.storeName} Portal!`);
      localStorage.setItem("activeStore", JSON.stringify({ name: Formdata.storeName, role: 'store' }));
      navigate("/admin/dashboard"); 
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-white">
      
      {/* LEFT SIDE - Branding Content */}
      <div className="hidden lg:flex w-1/2 bg-[#0e2a27] text-white p-8 lg:p-12 flex-col justify-center items-center relative">
        <div className="max-w-md text-center">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold leading-tight mb-4">
            Apexiums Retail<br />
            <span className="text-[#20b295]">Management Softwares</span>
          </h1>
          
          <p className="text-base text-gray-300 leading-relaxed mb-6 italic">
            "We deals in all kind or management software. We are here to help you to make your business full digitilize."
          </p>

          <div className="space-y-4">
            <div className="inline-block bg-[#20b295]/20 border border-[#20b295] px-6 py-2 rounded-full text-[#20b295] font-black text-lg uppercase tracking-wider">
              Book A free demo
            </div>
            
            <div className="flex flex-col items-center gap-1">
               <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Contact us</p>
               <p className="text-2xl font-black text-white bg-white/5 px-5 py-2 rounded-xl border border-white/10">
                 03405542097
               </p>
            </div>
          </div>

          <div className="mt-10 lg:mt-16">
            <p className="text-[15px] text-white font-bold tracking-[3px] uppercase">
              A project of Apexiums Technologies
            </p>
          </div>
        </div>

        {/* Floating Official WhatsApp Icon */}
        <a 
          href="https://wa.me/923405542097" 
          target="_blank" 
          rel="noreferrer"
          className="absolute bottom-6 right-6 bg-[#25D366] p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center group"
          title="Contact us on WhatsApp"
        >
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="white" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.67-1.613-.918-2.213-.242-.588-.487-.51-.67-.51h-.576c-.207 0-.543.078-.827.388-.283.31-1.08 1.055-1.08 2.572 0 1.517 1.102 2.984 1.25 3.183.149.199 2.169 3.31 5.253 4.643.733.315 1.305.504 1.75.647.736.23 1.405.197 1.933.118.588-.088 1.758-.718 2.01-1.411.25-.694.25-1.287.175-1.411-.075-.123-.277-.197-.573-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.55 4.12 1.524 5.857L0 24l6.293-1.654C7.88 23.45 9.877 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.884 0-3.655-.472-5.203-1.304l-.373-.2-.3.078L3.02 21.365l.791-2.95-.084-.138A9.957 9.957 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
          </svg>
        </a>
      </div>

      {/* RIGHT SIDE - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-10 relative">
        <div className="w-full max-w-sm">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#20b295] p-2.5 rounded-xl shadow-lg shadow-teal-500/20">
              <Building2 size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800 leading-none tracking-tighter uppercase">Apexiums</h2>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Management Software</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6 shadow-inner border border-gray-200">
            <button 
              onClick={() => setLoginMode("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${loginMode === "admin" ? "bg-white text-[#13786E] shadow-sm" : "text-gray-400"}`}
            >
              <ShieldCheck size={16} /> Admin Access
            </button>
            <button 
              onClick={() => setLoginMode("store")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${loginMode === "store" ? "bg-white text-[#13786E] shadow-sm" : "text-gray-400"}`}
            >
              <Store size={16} /> Store Portal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginMode === "admin" ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admin Email / ID</label>
                  <input
                    type="text"
                    placeholder="example@apex.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#20b295] outline-none text-sm"
                    onChange={(e) => setFormdata({ ...Formdata, identifier: e.target.value })}
                    value={Formdata.identifier}
                  />
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                  <input
                    type={Showpassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#20b295] outline-none text-sm"
                    onChange={(e) => setFormdata({ ...Formdata, password: e.target.value })}
                    value={Formdata.password}
                  />
                  <button type="button" onClick={() => setShowpassword(!Showpassword)} className="absolute right-4 top-[34px] text-gray-400">
                    {Showpassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Store Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Apexiums Mart"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#20b295] outline-none text-sm"
                    onChange={(e) => setFormdata({ ...Formdata, storeName: e.target.value })}
                    value={Formdata.storeName}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Registered Phone No.</label>
                  <input
                    type="text"
                    placeholder="0340-0000000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#20b295] outline-none text-sm"
                    onChange={(e) => setFormdata({ ...Formdata, phoneNumber: e.target.value })}
                    value={Formdata.phoneNumber}
                  />
                </div>
              </>
            )}

            <button
              disabled={loginMutation.isPending}
              type="submit"
              className="w-full bg-[#13786E] hover:bg-[#0e5a52] text-white font-black uppercase tracking-widest py-3.5 rounded-xl shadow-lg transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? "Connecting..." : "Access Dashboard"}
              <ArrowRight size={16} />
            </button>

            <div className="mt-4 text-center pt-4 border-t border-gray-50">
              <p className="text-gray-400 font-bold text-[9px] uppercase tracking-wider mb-2">
                {loginMode === "admin" ? "Are you a store owner?" : "Are you an official admin?"}
              </p>
              <button
                type="button"
                onClick={() => setLoginMode(loginMode === "admin" ? "store" : "admin")}
                className="flex items-center justify-center gap-1 mx-auto text-[#13786E] font-black text-[10px] uppercase hover:underline"
              >
                {loginMode === "admin" ? "Go to Store Portal" : "Switch to Admin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;