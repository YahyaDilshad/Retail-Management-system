import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, Phone } from "lucide-react";
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
      navigate("/admin");
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
    <div className="flex min-h-screen w-full font-sans">
      
      {/* LEFT SIDE - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#0e2a27] text-white p-16 flex-col justify-center relative">
        <div className="max-w-md">
          <h1 className="text-4xl font-serif font-bold leading-tight">
            Apexiums <span className="text-[#20b295]">Management Softwares</span>
          </h1>
          <p className="mt-8 text-lg text-gray-300">
            We deals in all kind of management softwares.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xl font-semibold">
            <span>Contact us :</span>
            <span className="text-white text-lg">03405542097</span>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-700">
            <p className="text-md font-medium">
              Collaborate with us and make your business digital
            </p>
          </div>
        </div>

        {/* Floating WhatsApp Button */}
        <div className="absolute bottom-10 left-16 bg-[#25D366] p-3 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.67-1.613-.918-2.213-.242-.588-.487-.51-.67-.51h-.576c-.207 0-.543.078-.827.388-.283.31-1.08 1.055-1.08 2.572 0 1.517 1.102 2.984 1.25 3.183.149.199 2.169 3.31 5.253 4.643.733.315 1.305.504 1.75.647.736.23 1.405.197 1.933.118.588-.088 1.758-.718 2.01-1.411.25-.694.25-1.287.175-1.411-.075-.123-.277-.197-.573-.347z"/>
          </svg>
        </div>
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
                Username
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
              className="w-full bg-[#20b295] hover:bg-[#1a947c] text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-all active:scale-95 disabled:opacity-70"
            >
              {signUpResult.isPending ? "Processing..." : "Log in"}
            </button>
          </form>

          {/* Footer Branding for Mobile */}
          <p className="mt-10 text-center lg:hidden text-gray-500 text-sm">
            © 2024 Apexiums Management Softwares
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;