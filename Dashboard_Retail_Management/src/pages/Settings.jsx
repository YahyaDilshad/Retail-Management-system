import React, { useState } from "react";
import { 
  Lock, ShieldCheck, Eye, EyeOff, Save, RefreshCw, AlertCircle 
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState({ old: false, new: false });

  const [securityData, setSecurityData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // --- HANDLER: CHANGE PASSWORD ---
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Validations
    if (!securityData.oldPassword || !securityData.newPassword || !securityData.confirmPassword) {
      return toast.error("All fields are required");
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    if (securityData.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    setIsLoading(true);
    try {
      // Backend Route: /auth/change-password
      await axiosInstance.put("/auth/change-password", {
        oldPassword: securityData.oldPassword,
        newPassword: securityData.newPassword
      });
      
      toast.success("Security credentials updated successfully!");
      
      // Form reset
      setSecurityData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 ml-64 min-h-screen bg-[#F8FAFC] p-8 mt-16 text-left font-sans">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic flex items-center gap-3">
          <Lock size={32} className="text-[#13786E]" /> Account Security
        </h1>
        <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">
          Update your administrative access key
        </p>
      </div>

      <div className="max-w-2xl mx-auto lg:mx-0">
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-10 relative overflow-hidden">
          
          {/* Decorative Background Icon */}
          <ShieldCheck size={150} className="absolute -right-10 -bottom-10 text-teal-50 opacity-50" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-teal-50 p-3 rounded-2xl text-[#13786E]">
                 <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Security Credentials</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Ensure your account stays protected</p>
              </div>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              
              {/* Current Password */}
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                <div className="relative">
                  <input 
                    type={showPass.old ? "text" : "password"} 
                    placeholder="Enter your current password"
                    value={securityData.oldPassword}
                    onChange={(e) => setSecurityData({...securityData, oldPassword: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700 transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass({...showPass, old: !showPass.old})}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600"
                  >
                    {showPass.old ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPass.new ? "text" : "password"} 
                      placeholder="••••••••"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700 transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPass({...showPass, new: !showPass.new})}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPass.new ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700 transition-all"
                  />
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3 mt-4">
                 <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                 <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                   Admin, changing your password will not log you out, but please make sure to remember your new credentials for the next session.
                 </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full md:w-auto px-12 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[11px] tracking-[2px] shadow-xl shadow-teal-900/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isLoading ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>}
                  {isLoading ? "Updating..." : "Confirm & Update Password"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;