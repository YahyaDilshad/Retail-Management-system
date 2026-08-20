import React, { useState } from "react";
import { 
  UserCheck, Search, Plus, Star, Mail, 
  Phone, MessageSquare, Trash2, Edit, 
  UserCircle, Filter, Download, MoreHorizontal
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";

const Clients = () => {
  const [searchItem, setSearchItem] = useState("");
  const queryClient = useQueryClient();

  // 1. Fetch Clients Data
  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await axiosInstance.get('/clients'); // Apne endpoint ke mutabiq change karein
      return res.data?.data || res.data || [];
    }
  });

  // 2. Delete Client Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
      Swal.fire("Deleted!", "Client record removed.", "success");
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Client?",
      text: "This will remove all purchase history and reviews for this client.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#13786E",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete"
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  // Helper function for Stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} 
      />
    ));
  };

  // Filter Search
  const filteredClients = Array.isArray(clientsData) ? clientsData.filter(client => 
    client.name?.toLowerCase().includes(searchItem.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchItem.toLowerCase())
  ) : [];

  return (
    <div className="flex-1 ml-64 min-h-screen bg-[#F8FAFC] p-8 mt-16">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <UserCheck className="text-[#13786E]" size={32} /> Client Reviews
          </h1>
          <p className="text-gray-500">Manage customer relationships and feedback</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#13786E] w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#13786E] text-white rounded-xl font-bold hover:bg-[#0e5e56] shadow-lg shadow-teal-900/10 transition-all">
            <Plus size={20} /> Add Client
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Clients" value={filteredClients.length} icon={<UserCircle size={20}/>} color="text-blue-600" />
        <StatsCard title="Average Rating" value="4.8/5" icon={<Star size={20}/>} color="text-yellow-500" />
        <StatsCard title="Positive Feedback" value="92%" icon={<MessageSquare size={20}/>} color="text-emerald-600" />
      </div>

      {/* Clients Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Client</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Contact Info</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Latest Review</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Rating</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-20 text-center text-gray-400">Loading client data...</td></tr>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client, idx) => (
                  <tr key={client._id || idx} className="hover:bg-teal-50/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-[#13786E] font-bold">
                          {client.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{client.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Loyalty Member</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        <p className="flex items-center gap-2 text-gray-600"><Mail size={12}/> {client.email}</p>
                        <p className="flex items-center gap-2 text-gray-600"><Phone size={12}/> {client.phone || "+92 3XX XXXXXXX"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 italic line-clamp-2">
                          "{client.review || "Excellent service and high-quality products!"}"
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">
                        {renderStars(client.rating || 5)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-500"><Edit size={16}/></button>
                        <button 
                          onClick={() => handleDelete(client._id || client.id)}
                          className="p-2 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 text-red-500"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-20 text-center text-gray-400 italic">No clients found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Sub-component for Stats
const StatsCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`p-3 rounded-xl bg-gray-50 ${color}`}>
      {icon}
    </div>
  </div>
);

export default Clients;