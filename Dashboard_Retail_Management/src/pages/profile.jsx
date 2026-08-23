import React, { useState, useEffect } from "react";
import { 
  User, MapPin, Phone, Mail, Save, 
  Camera, ShieldCheck, RefreshCw, Briefcase, 
  CheckCircle2, Globe 
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    role: "Administrator"
  });

  // --- 1. FETCH CURRENT PROFILE DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        const user = res.data?.user;
        if (user) {
          setProfileData({
            username: user.username || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            role: user.role || "Administrator"
          });
        }
      } catch (error) {
        console.error("Profile Fetch Error");
      }
    };
    fetchProfile();
  }, []);

  // --- 2. UPDATE PROFILE HANDLER ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!profileData.username || !profileData.phone) {
      return toast.error("Name and Phone are required");
    }

    setIsLoading(true);
    try {
      // Backend Route: /auth/update-profile
      await axiosInstance.put("/auth/update-profile", {
        username: profileData.username,
        phone: profileData.phone,
        address: profileData.address
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 ml-64 min-h-screen bg-[#F8FAFC] p-8 mt-14 font-sans text-left text-gray-800">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#13786E] tracking-tighter uppercase italic flex items-center gap-3">
          <User size={32} /> Personal Profile
        </h1>
        <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">Manage your identity and contact information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Profile Preview Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
            {/* Header Background */}
            <div className="absolute top-0 left-0 w-full h-24 bg-[#13786E]/5"></div>
            
            <div className="relative z-10">
               {/* Avatar */}
               <div className="w-28 h-28 rounded-[2rem] bg-[#13786E] mx-auto mb-4 flex items-center justify-center text-white shadow-xl relative group">
                  <User size={48} />
                  <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg text-[#13786E] hover:scale-110 transition-transform">
                    <Camera size={16}/>
                  </button>
               </div>
               
               <h2 className="text-xl font-black tracking-tight">{profileData.username || "User Name"}</h2>
               <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full mt-2 inline-block">
                 {profileData.role}
               </p>

               <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                     <Mail size={16} className="text-[#13786E]"/>
                     <span className="text-xs font-bold text-gray-500 truncate">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                     <Phone size={16} className="text-[#13786E]"/>
                     <span className="text-xs font-bold text-gray-500">{profileData.phone || "No Phone"}</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="mt-6 bg-gray-900 rounded-[2rem] p-6 text-white shadow-xl shadow-gray-200">
             <div className="flex items-center gap-3 mb-2">
                <ShieldCheck size={20} className="text-teal-400"/>
                <h3 className="font-black text-xs uppercase tracking-widest">Verified Account</h3>
             </div>
             <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Your account is secured with end-to-end encryption. All changes are logged.</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#13786E]"/> Edit Your Information
            </h3>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <User size={14} className="text-[#13786E]"/> Full Name
                  </label>
                  <input 
                    type="text" value={profileData.username}
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700 transition-all"
                  />
                </div>

                {/* Phone Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Phone size={14} className="text-[#13786E]"/> Phone Number
                  </label>
                  <input 
                    type="text" value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="03xx-xxxxxxx"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700 transition-all"
                  />
                </div>

                {/* Email (Read Only for security) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Mail size={14} className="text-gray-300"/> Official Email (Fixed)
                  </label>
                  <input 
                    type="email" value={profileData.email} disabled
                    className="w-full px-5 py-4 bg-gray-100 border border-gray-100 rounded-2xl outline-none text-sm font-bold text-gray-400 cursor-not-allowed"
                  />
                </div>

                {/* Role (Read Only) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Briefcase size={14} className="text-gray-300"/> Designation
                  </label>
                  <input 
                    type="text" value={profileData.role} disabled
                    className="w-full px-5 py-4 bg-gray-100 border border-gray-100 rounded-2xl outline-none text-sm font-bold text-gray-400 cursor-not-allowed"
                  />
                </div>

                {/* Address Input (Full Width) */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MapPin size={14} className="text-[#13786E]"/> Home / Office Address
                  </label>
                  <textarea 
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    placeholder="Full residential or shop address..."
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700 transition-all h-32 resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex justify-end">
                 <button 
                   type="submit" disabled={isLoading}
                   className="bg-[#13786E] text-white px-12 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[2px] shadow-xl shadow-teal-900/20 active:scale-95 transition-all flex items-center gap-3"
                 >
                   {isLoading ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>}
                   Save Profile Settings
                 </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;