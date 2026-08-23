import React, { useState, useEffect } from "react";
import { 
  User, Lock, Mail, Phone, Save, 
  ShieldCheck, RefreshCw, Store, Bell, Camera 
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  // 1. Form States (Mapping to your Mongoose Schema)
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    role: "",
  });

  const [securityData, setSecurityData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // --- FETCH USER DATA FROM BACKEND ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        // Aapka backend data structure: { authenticated: true, user: { ... } }
        const user = res.data?.user; 
        if (user) {
          setProfileData({
            username: user.username || "",
            email: user.email || "",
            role: user.role || "user",
          });
        }
      } catch (error) {
        console.error("Settings Error:", error.message);
      }
    };
    fetchUserData();
  }, []);

  // --- HANDLER: UPDATE PROFILE ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Backend Route: /auth/update-profile
      await axiosInstance.put("/auth/update-profile", {
        username: profileData.username,
        email: profileData.email
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLER: CHANGE PASSWORD ---
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      return toast.error("Confirm password does not match!");
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
      toast.success("Security credentials updated!");
      setSecurityData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Admin Profile", icon: <User size={18} /> },
    { id: "security", label: "Security", icon: <Lock size={18} /> },
  ];

  return (
    <div className="flex-1 ml-64 min-h-screen bg-[#F8FAFC] p-8 mt-16 text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic">Account Settings</h1>
        <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase">Manage your Apexiums identity and security</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR TABS */}
        <div className="w-full lg:w-64 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-black transition-all ${
                activeTab === tab.id 
                ? "bg-[#13786E] text-white shadow-lg" 
                : "bg-white text-gray-400 hover:bg-teal-50"
              }`}
            >
              {tab.icon}
              <span className="text-[10px] uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-10">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-black text-gray-800 mb-8 uppercase tracking-tight">Identity Information</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SettingsInput 
                    label="Username" 
                    value={profileData.username} 
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                  />
                  <SettingsInput 
                    label="Email Address"  
                    value={profileData.email} 
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                  <SettingsInput label="System Role" value={profileData.role} disabled={true} />
              </div>
                <div className="mt-10 pt-6 border-t border-gray-50 flex justify-end">
                  <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-10 py-3.5 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
                    {isLoading ? <RefreshCw className="animate-spin" size={16}/> : <Save size={16} />} Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-black text-gray-800 mb-8 uppercase tracking-tight flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" /> Account Security
              </h2>
              <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-6">
                <SettingsInput 
                  label="Current Password" type="password" placeholder="••••••••" 
                  value={securityData.oldPassword} 
                  onChange={(e) => setSecurityData({...securityData, oldPassword: e.target.value})}
                />
                <SettingsInput 
                  label="New Admin Password" type="password" placeholder="••••••••" 
                  value={securityData.newPassword} 
                  onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                />
                <SettingsInput 
                  label="Confirm Password" type="password" placeholder="••••••••" 
                  value={securityData.confirmPassword} 
                  onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                />
                <div className="mt-8 pt-6 border-t border-gray-50">
                  <button type="submit" disabled={isLoading} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
                    {isLoading ? "Validating..." : "Update Security Key"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component
const SettingsInput = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      {...props}
      className="border border-gray-200 p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700 transition-all disabled:opacity-50"
    />
  </div>
);

export default Settings;