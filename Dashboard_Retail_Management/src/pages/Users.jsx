import React, { useState } from "react";
import { 
  Users, Search, UserPlus, Trash2, Edit, 
  ShieldCheck, Mail, ShieldAlert, X, 
  MoreVertical, CheckCircle2, AlertTriangle, UserCircle
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";

const AllUsers = () => {
  const [searchItem, setSearchItem] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const queryClient = useQueryClient();

  // 1. Fetch All Users
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/all-users'); // Apne endpoint ke mutabiq change karein
      return res.data?.users || res.data?.data || [];
    }
  });

  // 2. Delete User Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/auth/user/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['all-users']);
      Swal.fire("Deleted!", "User account has been removed.", "success");
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will lose all access to the system!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Yes, delete user"
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  // Filter Search
  const filteredUsers = Array.isArray(usersData) ? usersData.filter(user => 
    user.Name?.toLowerCase().includes(searchItem.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchItem.toLowerCase())
  ) : [];

  return (
    <div className="flex-1 ml-64 min-h-[90%] mt-14 bg-[#F8FAFC] p-8 transition-all duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Users className="text-[#13786E]" size={32} /> User Management
          </h1>
          <p className="text-gray-500">Manage system access, roles and user accounts</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#13786E] w-72 shadow-sm"
            />
          </div>
          <button 
            className="flex items-center gap-2 px-6 py-2.5 bg-[#13786E] text-white rounded-xl font-bold hover:bg-[#0e5e56] shadow-lg shadow-teal-900/10 transition-all"
          >
            <UserPlus size={20} /> Add Admin/User
          </button>
        </div>
      </div>

      {/* Stats Quick Overview (Optional but looks professional) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase">Total Users</p>
            <p className="text-2xl font-bold text-gray-800">{filteredUsers.length}</p>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-teal-600 uppercase">Active Now</p>
            <p className="text-2xl font-bold text-gray-800">{filteredUsers.length}</p>
         </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">User Identity</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Role / Designation</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Access Level</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-8 h-8 border-4 border-[#13786E] border-t-transparent rounded-full animate-spin"></div>
                       <p className="text-gray-400 font-medium">Loading user database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => (
                  <tr key={user._id || idx} className="hover:bg-teal-50/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-[#13786E] font-bold border border-teal-200">
                          {user.Name ? user.Name.charAt(0).toUpperCase() : <UserCircle />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 leading-none mb-1">{user.Name || "Unknown User"}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Mail size={12} /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 uppercase text-[10px]">
                        {user.role || user.Designation || "System User"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'admin' ? (
                        <div className="flex items-center gap-1.5 text-purple-600 font-bold text-xs uppercase">
                          <ShieldCheck size={16} /> Full Control
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-gray-500 font-bold text-xs uppercase">
                          <ShieldAlert size={16} /> Restricted
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
                        <CheckCircle2 size={12} /> Active
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-600 shadow-sm transition-all" title="Edit User">
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id)}
                          className="p-2 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 text-red-500 shadow-sm transition-all"
                          title="Delete Account"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <AlertTriangle size={48} className="opacity-20" />
                      <p className="italic">No users found in the system.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;