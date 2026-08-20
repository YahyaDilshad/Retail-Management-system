import React, { useState } from "react";
import { 
  Plus, Trash2, Edit, Loader, Search, 
  UserPlus, X, CreditCard, Briefcase, 
  MapPin, Phone, Mail, UserCheck, FileText 
} from "lucide-react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import Swal from 'sweetalert2';
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const Staff = () => {
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const queryClient = useQueryClient();

  // Fetch Staff Data
  const results = useQueries({
    queries: [
      {
        queryKey: ['staffs'],
        queryFn: async () => {
          const res = await axiosInstance.get('/staff');
          return res.data;
        }
      }
    ]
  });

  const staffList = results[0]?.data?.data || [];
  const isLoading = results[0].isLoading;

  // Mutation for Creating Staff
  const createStaffMutation = useMutation({
    mutationFn: async (data) => {
      return await axiosInstance.post('/staff/create', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['staffs']);
      toast.success("✅ Staff Member Added Successfully!");
      resetForm();
      setShowStaffForm(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add staff");
    }
  });

  // Form State
  const [formData, setFormData] = useState({
    Name: "", FatherName: "", Designation: "", CNICnumber: "",
    MobileNumber: "", Address: "", Gender: "", bankHolderName: "",
    AccountNumber: "", BranchName: "", email: "",
    IDFrontImage: null, IDBackImage: null
  });

  const resetForm = () => {
    setFormData({
      Name: "", FatherName: "", Designation: "", CNICnumber: "",
      MobileNumber: "", Address: "", Gender: "", bankHolderName: "",
      AccountNumber: "", BranchName: "", email: "",
      IDFrontImage: null, IDBackImage: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.IDFrontImage || !formData.IDBackImage) {
      return toast.error("Please upload both sides of the ID card");
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    createStaffMutation.mutate(data);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this staff record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#13786E",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/staff/${id}`);
          queryClient.invalidateQueries(['staffs']);
          Swal.fire("Deleted!", "Staff has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete staff.", "error");
        }
      }
    });
  };

  // Filter Search
  const filteredStaff = staffList.filter(staff => 
    staff.Name?.toLowerCase().includes(searchItem.toLowerCase()) ||
    staff.Designation?.toLowerCase().includes(searchItem.toLowerCase()) ||
    staff.CNICnumber?.includes(searchItem)
  );

  return (
    <div className="flex-1 ml-64 min-h-[90%] mt-14 bg-[#F8FAFC] p-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-500">Manage your team members and their information</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, role or CNIC..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-72 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#13786E] focus:border-transparent outline-none shadow-sm transition-all"
            />
          </div>
          <button
            onClick={() => setShowStaffForm(!showStaffForm)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md ${
              showStaffForm ? "bg-gray-200 text-gray-700" : "bg-[#13786E] text-white hover:bg-[#0e5e56]"
            }`}
          >
            {showStaffForm ? <X size={20} /> : <UserPlus size={20} />}
            {showStaffForm ? "Close Form" : "Add Staff"}
          </button>
        </div>
      </div>

      {/* Add Staff Form Section */}
      {showStaffForm && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <UserCheck className="text-[#13786E]" /> Member Registration
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Personal Info Group */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-600 border-b border-teal-50 pb-1">Personal Details</p>
                <InputField label="Full Name" name="Name" value={formData.Name} onChange={handleInputChange} icon={<Mail size={16}/>} />
                <InputField label="Father's Name" name="FatherName" value={formData.FatherName} onChange={handleInputChange} />
                <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <select name="Gender" value={formData.Gender} onChange={handleInputChange} className="border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* Professional & Contact Group */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-600 border-b border-teal-50 pb-1">Professional Info</p>
                <InputField label="Designation" name="Designation" value={formData.Designation} onChange={handleInputChange} />
                <InputField label="CNIC Number" name="CNICnumber" value={formData.CNICnumber} onChange={handleInputChange} />
                <InputField label="Mobile Number" name="MobileNumber" value={formData.MobileNumber} onChange={handleInputChange} />
                <InputField label="Current Address" name="Address" value={formData.Address} onChange={handleInputChange} />
              </div>

              {/* Bank Details Group */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-600 border-b border-teal-50 pb-1">Payroll / Bank Info</p>
                <InputField label="Account Holder Name" name="bankHolderName" value={formData.bankHolderName} onChange={handleInputChange} />
                <InputField label="Account Number" name="AccountNumber" value={formData.AccountNumber} onChange={handleInputChange} />
                <InputField label="Branch Name" name="BranchName" value={formData.BranchName} onChange={handleInputChange} />
                
                <div className="grid grid-cols-2 gap-2">
                  <FileInput label="ID Front" name="IDFrontImage" onChange={handleFileChange} />
                  <FileInput label="ID Back" name="IDBackImage" onChange={handleFileChange} />
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
              <button 
                type="button" 
                onClick={resetForm}
                className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium"
              >
                Clear All
              </button>
              <button 
                type="submit" 
                disabled={createStaffMutation.isPending}
                className="px-8 py-2 bg-[#13786E] text-white rounded-xl font-bold hover:bg-[#0e5e56] shadow-lg shadow-teal-900/10 flex items-center gap-2 disabled:opacity-50"
              >
                {createStaffMutation.isPending ? <Loader className="animate-spin" size={20}/> : "Register Staff Member"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff Table Section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Staff Info</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">CNIC</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Bank Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader className="animate-spin inline-block text-[#13786E] mb-2" size={32} />
                    <p className="text-gray-500">Loading staff data...</p>
                  </td>
                </tr>
              ) : filteredStaff.length > 0 ? (
                filteredStaff.map((staff, idx) => (
                  <tr key={idx} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-800">{staff.Name}</p>
                        <p className="text-xs text-gray-500">{staff.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-teal-100 text-[#13786E] rounded-full text-xs font-bold uppercase">
                        {staff.Designation}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{staff.CNICnumber}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="flex items-center gap-1 text-gray-700"><Phone size={12}/> {staff.MobileNumber}</p>
                        <p className="text-xs text-gray-400 truncate w-32">{staff.Address}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500">
                        <p className="font-medium text-gray-700">{staff.bankHolderName}</p>
                        <p>{staff.AccountNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-600 shadow-sm transition-all">
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(staff._id || staff.id)}
                          className="p-2 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 text-red-500 shadow-sm transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-gray-400 italic">
                    No staff members found.
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

// Reusable Components for clean code
const InputField = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <input
      {...props}
      className="border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-sm transition-all"
    />
  </div>
);

const FileInput = ({ label, name, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
    <label className="cursor-pointer border border-dashed border-gray-300 rounded-lg p-2 hover:bg-teal-50 hover:border-teal-300 transition-all text-center">
      <FileText size={16} className="mx-auto text-gray-400 mb-1" />
      <span className="text-[10px] text-gray-500 block truncate">Choose Image</span>
      <input type="file" name={name} accept="image/*" onChange={onChange} className="hidden" />
    </label>
  </div>
);

export default Staff;