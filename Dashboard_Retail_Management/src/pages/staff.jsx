import React, { useState } from "react";
import { 
  Plus, Trash2, Edit, Search, 
  UserPlus, X, UserCheck, FileText, 
  Phone, Mail, Briefcase, MapPin 
} from "lucide-react";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";

const Staff = () => {
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [editingId, setEditingId] = useState(null); // Edit track karne ke liye

  // 1. Initial Dummy Data (Frontend State)
  const [staffList, setStaffList] = useState([
    {
      id: 1, Name: "Zeeshan Ali", FatherName: "Ali Ahmed", Designation: "Manager", 
      CNICnumber: "42101-1234567-1", MobileNumber: "0300-1122334", 
      Address: "Street 4, Karachi", Gender: "Male", email: "zeeshan@example.com",
      bankHolderName: "Zeeshan Ali", AccountNumber: "PK12MEZN00123", BranchName: "Meezan Main"
    }
  ]);

  // 2. Form State
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
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Add/Update Staff Logic (Frontend Only)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.Name || !formData.Designation) {
      return toast.error("Please fill all required fields");
    }

    if (editingId) {
      // Edit Logic
      setStaffList(staffList.map(staff => 
        staff.id === editingId ? { ...formData, id: editingId } : staff
      ));
      toast.success("✅ Staff record updated!");
    } else {
      // Create Logic
      const newStaff = { ...formData, id: Date.now() };
      setStaffList([...staffList, newStaff]);
      toast.success("✅ Staff member added successfully!");
    }

    resetForm();
    setShowStaffForm(false);
  };

  // 4. Delete Staff Logic
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#13786E",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        setStaffList(staffList.filter(staff => staff.id !== id));
        Swal.fire("Deleted!", "Staff record has been removed.", "success");
      }
    });
  };

  // 5. Trigger Edit Mode
  const handleEdit = (staff) => {
    setFormData(staff);
    setEditingId(staff.id);
    setShowStaffForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              placeholder="Search staff..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-64 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#13786E] outline-none shadow-sm transition-all"
            />
          </div>
          <button
            onClick={() => {
              if (showStaffForm) resetForm();
              setShowStaffForm(!showStaffForm);
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md ${
              showStaffForm ? "bg-gray-200 text-gray-700" : "bg-[#13786E] text-white hover:bg-[#0e5e56]"
            }`}
          >
            {showStaffForm ? <X size={20} /> : <UserPlus size={20} />}
            {showStaffForm ? "Cancel" : "Add Staff"}
          </button>
        </div>
      </div>

      {/* Form Section */}
      {showStaffForm && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <UserCheck className="text-[#13786E]" /> {editingId ? "Edit Staff Member" : "New Registration"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Personal Details */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-600 border-b pb-1">Personal Details</p>
                <InputField label="Full Name" name="Name" value={formData.Name} onChange={handleInputChange} />
                <InputField label="Father's Name" name="FatherName" value={formData.FatherName} onChange={handleInputChange} />
                <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <select name="Gender" value={formData.Gender} onChange={handleInputChange} className="border border-gray-200 p-2.5 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* Professional Info */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-600 border-b pb-1">Professional Info</p>
                <InputField label="Designation" name="Designation" value={formData.Designation} onChange={handleInputChange} />
                <InputField label="CNIC Number" name="CNICnumber" value={formData.CNICnumber} onChange={handleInputChange} />
                <InputField label="Mobile Number" name="MobileNumber" value={formData.MobileNumber} onChange={handleInputChange} />
                <InputField label="Address" name="Address" value={formData.Address} onChange={handleInputChange} />
              </div>

              {/* Bank Info */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-600 border-b pb-1">Bank Info</p>
                <InputField label="Bank Holder" name="bankHolderName" value={formData.bankHolderName} onChange={handleInputChange} />
                <InputField label="Account #" name="AccountNumber" value={formData.AccountNumber} onChange={handleInputChange} />
                <InputField label="Branch" name="BranchName" value={formData.BranchName} onChange={handleInputChange} />
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={resetForm} className="px-6 py-2 text-gray-500 hover:text-gray-700">Clear</button>
              <button type="submit" className="px-8 py-2 bg-[#13786E] text-white rounded-xl font-bold hover:bg-[#0e5e56] shadow-lg">
                {editingId ? "Update Member" : "Register Member"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Staff Info</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Role</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Contact</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-teal-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{staff.Name}</p>
                    <p className="text-xs text-gray-500">CNIC: {staff.CNICnumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-teal-100 text-[#13786E] rounded-full text-[10px] font-bold uppercase">
                      {staff.Designation}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p className="flex items-center gap-1"><Phone size={12}/> {staff.MobileNumber}</p>
                    <p className="flex items-center gap-1 text-xs text-gray-400"><Mail size={12}/> {staff.email}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(staff)} className="p-2 hover:bg-white rounded-lg border text-gray-600 shadow-sm transition-all"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(staff.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 shadow-sm transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-20 text-center text-gray-400">No members found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <input
      {...props}
      className="border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-sm transition-all"
    />
  </div>
);

export default Staff;