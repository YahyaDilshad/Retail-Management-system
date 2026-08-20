import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const [Showpassword, setShowpassword] = useState(false);
  const [Formdata, setFormdata] = useState({
    identifier : "",
    password: "",
    role: "admin",
  });
 
  const signUpResult = useMutation({
    mutationFn : async(payload)=>{
      console.log("User SignUp" , payload)
      const res = await axiosInstance.post("/auth/signup", payload)
      console.log("hiting api",res)
    },onSuccess: ()=>{
        queryClient.invalidateQueries(["authUser"])      
    }
  })
  // ✅ Form Validation
  const Formvalidate = () => {
    const { identifier , password } = Formdata;
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

  // ✅ Handle Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Formvalidate()) return;
      const payload = {
        identifier: Formdata.identifier,
        password: Formdata.password,
        role: "admin",
      };
    try {
        await signUpResult.mutateAsync(payload);
        toast.success("Signup successful!");
        navigate("/admin");
      }
    catch (error) {
      console.error("Signup error:", error.message);
      toast.error("Signup failed. Try again.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#E6F2F3]    ">
      <div className="w-100 h-[34rem] overflow-hidden shadow-2xl shadow-[#bfeaee] md:w-1/3 absolute rounded-2xl left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%]   flex item-center flex-col justify-center bg-white">
        <div className="w-full h-60 flex flex-col items-center justify-center gap-3 mb-6 bg-[#13786E]">
          
          <div className="flex items-center justify-center flex-col ">
            <Home size={10} className="w-15 h-15 p-3 mb-5 mt-3  rounded-full   bg-[#ffffff42] text-white" />
            <div className="text-white text-2xl mb-2 font-semibold">Apexiums Retail Management</div>
            <p className="text-white mb-6">
              Sign In Your Account
            </p>
        </div>
        </div>

        {/* ✅ Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-5 ">
          <div className="flex gap-3 w-full">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Email/Username
              </label>
              <input
                onChange={(e) =>
                  setFormdata((prev) => ({
                    ...prev,
                    identifier: e.target.value,
                  }))
                }
                value={Formdata.identifier}
                type="text"
                placeholder="Email/Username"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#13786E]"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password*
            </label>
            <input
              onChange={(e) =>
                setFormdata((prev) => ({ ...prev, password: e.target.value }))
              }
              value={Formdata.password}
              type={Showpassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#13786E]"
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
            className="cursor-pointer w-full p-3 mt-4 mb-7 text-white bg-[#13786E] rounded-md"
          >
            {signUpResult.isPending ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>  
    </div>
  );
};

export default SignUp;
