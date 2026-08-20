import React, { useState } from "react";
import { 
  User, Lock, Bell, Globe, 
  Store, Mail, Phone, Camera, 
  Save, ShieldCheck, CreditCard, Trash2 
} from "lucide-react";
import { toast } from "react-toastify";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Tabs Configuration
  const tabs = [
    { id: "profile", label: "Admin Profile", icon: <User size={18} /> },
    { id: "business", label: "Business Info", icon: <Store size={18} /> },
    { id: "security", label: "Security", icon: <Lock size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  ];

  return (
    <div className="flex-1 ml-64 min-h-screen bg-[#F8FAFC] p-8 mt-16">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
        <p className="text-gray-500">Manage your profile, business details and system preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === tab.id 
                ? "bg-[#13786E] text-white shadow-lg shadow-teal-900/20" 
                : "bg-white text-gray-500 hover:bg-teal-50 hover:text-[#13786E]"
              }`}
            >
              {tab.icon}
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-teal-50 flex items-center justify-center text-[#13786E] border-2 border-dashed border-teal-200 overflow-hidden">
                    <User size={40} />
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-[#13786E] text-white rounded-lg shadow-lg hover:scale-110 transition-transform">
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-gray-800">Admin Photo</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingsInput label="Full Name" placeholder="e.g. Ali Ahmed" />
                <SettingsInput label="Email Address" placeholder="admin@apexiums.com" type="email" />
                <SettingsInput label="Phone Number" placeholder="+92 300 0000000" />
                <SettingsInput label="Designation" placeholder="Super Admin" disabled={true} />
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end">
                <button className="flex items-center gap-2 px-8 py-2.5 bg-[#13786E] text-white rounded-xl font-bold hover:bg-[#0e5e56] transition-all">
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* BUSINESS INFO TAB */}
          {activeTab === "business" && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Business Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingsInput label="Store Name" placeholder="Apexiums Retail Shop" />
                <SettingsInput label="Business Email" placeholder="sales@apexiums.com" />
                <SettingsInput label="GST Number" placeholder="3277876-1" />
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-sm font-medium text-gray-600">Store Address</label>
                  <textarea className="border border-gray-200 p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#13786E] h-24 text-sm" placeholder="Street 12, Commercial Area..."></textarea>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end">
                <button className="flex items-center gap-2 px-8 py-2.5 bg-[#13786E] text-white rounded-xl font-bold hover:bg-[#0e5e56] transition-all">
                  <Save size={18} /> Update Store
                </button>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" /> Password & Security
              </h2>
              <div className="max-w-md space-y-6">
                <SettingsInput label="Current Password" type="password" />
                <SettingsInput label="New Password" type="password" />
                <SettingsInput label="Confirm New Password" type="password" />
              </div>
              <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end">
                <button className="flex items-center gap-2 px-8 py-2.5 bg-[#13786E] text-white rounded-xl font-bold hover:bg-[#0e5e56] transition-all">
                   Update Password
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                <ToggleItem title="Email Notifications" desc="Receive daily sales reports via email" />
                <ToggleItem title="Low Stock Alerts" desc="Notify when products go below 10 units" defaultChecked={true} />
                <ToggleItem title="New Order Alerts" desc="Instant desktop notification for new billings" defaultChecked={true} />
                <ToggleItem title="Marketing Updates" desc="Information about new system features" />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// --- Sub-components for cleaner code ---

const SettingsInput = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <input
      {...props}
      className="border border-gray-200 p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#13786E] text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

const ToggleItem = ({ title, desc, defaultChecked = false }) => (
  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
    <div>
      <p className="text-sm font-bold text-gray-800">{title}</p>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13786E]"></div>
    </label>
  </div>
);

export default Settings;