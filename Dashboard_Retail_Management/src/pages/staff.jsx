  import React, { useEffect, useState } from "react";
  import useProductStore from "../store/productauthstore";
  import { toast } from "react-toastify";
  import { Plus, BadgeCheck, FolderTree, Delete, Trash2, Edit, Loader } from "lucide-react";
  import {QueryCache, useMutation, useQueries, useQuery, useQueryClient} from "@tanstack/react-query"
  import Swal from 'sweetalert2';
  import axiosInstance from "../lib/axios";
  import { LoaderIcon } from "react-hot-toast";
  const Staff = () => {
    
    const [showstaffForm, setShowstaffForm] = useState(false);
    const [searchItem, setSearchItem] = useState("");
    
    const queryClient  = useQueryClient()
    const CreateStaffArray = useMutation(
      {
          mutationFn : async (data) =>{ 
            console.log("create Data" , data)
          const res = await axiosInstance.post('/staff/create' , data)
          },
          onSuccess : ()=>{
            queryClient.invalidateQueries(['staffs'])
          }
      }
  )
    const results = useQueries({
        queries :[
          {
            queryKey : ['staffs'],
            queryFn : async()=>{
              const res = await axiosInstance.get('/staff')
              return res.data

            }
          },
          
          
        ]
    
      })
    

    const FetchStaffsArray = results[0]?.data?.data || []
   // nst FetchSearchProducts = results[3].data || []
  

  // --------------Delete Staff ------------------

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you Sure you want to delete this Staff?",
      text: "Cannot get Staff after delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0e6d65",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Produst Delete",
      cancelButtonText: "cancel"
    }).then(async (result) => {
    if (result.isConfirmed) {
        try {
          const res = await axiosInstance.delete(`/staff/${id}`)
        
          if (res) {
            queryClient.invalidateQueries(['staffs'])
            // Success Custom Alert
            Swal.fire({
              title: "Deleted!",
              text: "Staff deleted SuccessFull",
              icon: "success",
              timer: 1500, // 1.5 seconds baad khud band ho jayega
              showConfirmButton: false
            });
          }
        } catch (error) {
          Swal.fire("Error!", "Something Went Wrong For deleting Staff.", "error");
        }
      }
    });
  };

    
    // ---------- Create Staff ----------
    const [formData, setFormData] = useState({
      Name : "",
      FatherName: "",
      Designation: "",
      CNICnumber: "",
      MobileNumber: "",
      Address: "",
      Gender: "",
      bankHolderName: "",
      AccountNumber: "",
      BranchName: "",
      email: "",
      IDFrontImage : null,
      IDBackImage: null
    });

    const handlestaffFile = (e) => {
    const { name , files} = e.target;
    setFormData((prev) => ({ ...prev , [name] : files[0]}))
    };
    const handleStaffChange = (e) => {
      const { name, value } = e.target; // Small letters use karein
      setFormData({ ...formData, [name]: value });
    };

  const handleSubmitstaff = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    
    // Text fields append karein
    data.append('Name', formData.Name);
    data.append('FatherName', formData.FatherName);
    data.append('Designation', formData.Designation);
    data.append('CNICnumber', formData.CNICnumber);
    data.append('Address' , formData.Address)
    data.append('BranchName', formData.BranchName);
    data.append('email', formData.email);
    data.append('AccountNumber', formData.AccountNumber);
    data.append('Gender', formData.Gender);
    data.append('bankHolderName', formData.bankHolderName);
    data.append('MobileNumber', formData.MobileNumber);

    if (formData.IDFrontImage) {
      data.append('IDFrontImage', formData.IDFrontImage); 
    } else {
      return toast.error("Please select an image"); // Image lazmi check karein
    }
    if(formData.IDBackImage){
        data.append('IDBackImage' , formData.IDBackImage)
    }else{
        return toast.error("PLease Select an Image for Back Side Of your ID card")
    }

    try {
      // Sahi mutation function call karein
      await CreateStaffArray.mutateAsync(data); 
      toast.success("✅ Staff added successfully!");
      
      // Form Reset
      setFormData({
        Name: "", FatherName: "", Designation: "",email : "" , Gender : "" ,BranchName : "" , AccountNumber : "", Address : "" , CNICnumber: "", MobileNumber: "", Address: "", IDBackImage: null,IDFrontImage: null
      });
      setShowstaffForm(false);
    } catch (error) {
      console.error("Backend Error:", error.response?.data || error.message);
      toast.error("❌ Failed to add Staff");
    }
  };

    // ---------- JSX ----------
    return (
     <div className="flex-1 ml-60 min-h-screen bg-[#F8FAFC] transition-all duration-300">
           <header className="w-full relative">
               <div className="px-6 mt-10 py-5 relative flex items-center justify-between">
                 <h1 className="font-bold text-3xl">Staff Management</h1>
               <div className=" w-[70%] flex items-center gap-2 justify-end">
                   {/* ---------- Search Bar ---------- */}
             <header className="px-6 py-5 w-fit flex items-center justify-between">
               <input
                 type="text"
                 value={searchItem}
                 placeholder="Search Staff..."
                 onChange={(e) => setSearchItem(e.target.value)}
                 className="border border-[#cfcfcf] p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-[#20B0A4]"
               />
             </header>
                   {/* Add Staff Button */}
                   <div
                     onClick={() => setShowstaffForm((prev) => !prev)}
                     className="btn bg-[#20B0A4] py-2 px-5 flex items-center text-white rounded cursor-pointer gap-2"
                   >
                     <Plus />
                     <button>Add Staff</button>
                   </div>
                 </div>
               </div>
             </header>
     
             
           <div className="w-full  overflow-hidden shadow-sm rounded-lg  ">
              {/* ---------- Add Product Form ---------- */}
               <div className={`transition-all ${
                   showstaffForm ? "h-[65vh]" : "h-0"
                 } w-full overflow-hidden  `}>
               <div className="m-5 p-10 border-gray-200 border rounded-lg bg-white ">
                 <h1 className="text-xl mb-3">Add New Staff</h1>
     
                 <form
                   onSubmit={e => handleSubmitstaff(e)}
                   className="py-5 w-full rounded flex items-center flex-wrap gap-6"
                 >
                   <div>
                     <h3 className="text-[#4B5563]">Name</h3>
                   <input
                     name="Name"
                     value={formData.Name}
                     onChange={e => handleStaffChange(e)}
                     className="border rounded outline-none border-[#D1D5DB] p-2 w-50 mb-2"
                   />
                   </div>
                   <div>
                     <h3 className="text-[#4B5563]">Father Name</h3>
                     <input
                     name="FatherName"
                     value={formData.FatherName}
                     onChange={e => handleStaffChange(e)}
                     className="border rounded outline-none border-[#cfcfcfda] p-2 w-50 mb-2"
                   />
                   </div>
                   <div>
                     <h3 className="text-[#4B5563]">Email</h3>
                   <input
                     name="email"
                     value={formData.email}
                     onChange={e => handleStaffChange(e)}
                     className="border rounded outline-none border-[#cfcfcfda] p-2 w-50 mb-2"
                   />
                   </div>
                   <div>
                     <h3 className="text-[#4B5563]">Designation</h3>
                   <input
                     name="Designation"
                     value={formData.Designation}
                     onChange={e => handleStaffChange(e)}
                     className="border rounded outline-none border-[#cfcfcfda] p-2 w-50 mb-2"
                   />
                   </div>
                   {/* gender dropdown */}
                   <div>
                     <h3 className="text-[#4B5563]">Gender</h3>
                   <select
                     name="Gender"
                     value={formData.Gender}
                     onChange={e => handleStaffChange(e)}
                     className="border p-2 w-50 outline-none rounded border-[#cfcfcfda]"
                   >
                     <option value="">Select Gender</option>
                     <option value="Male">Male</option>
                     <option value="Female">Female</option>
                   </select>
                   </div>
                   <div>
                     <h3 className="text-[#4B5563]">CNIC Number</h3>
                   <input
                     name="CNICnumber"
                     value={formData.CNICnumber}
                     onChange={e => handleStaffChange(e)}
                     className="border outline-none border-[#cfcfcfda] p-2 w-50 "
                   />
                   </div>
                   <div>
                     <h3 className="text-[#4B5563]">Mobile Number</h3>
                   <input
                     name="MobileNumber"
                     value={formData.MobileNumber}
                     onChange={e => handleStaffChange(e)}
                     className="border outline-none border-[#cfcfcfda] p-2 w-50 "
                   />
                   </div>
                   <div>
                     <h3 className="text-[#4B5563]">Address</h3>
                   <input
                     name="Address"
                     value={formData.Address}
                     onChange={e => handleStaffChange(e)}
                     className="border outline-none border-[#cfcfcfda] p-2 w-50 "
                   />
                   </div>
                   <div>
                     <h3 className="text-[#4B5563]">Account Number</h3>
                   <input
                     name="AccountNumber"
                     value={formData.AccountNumber}
                     onChange={e => handleStaffChange(e)}
                     className="border outline-none border-[#cfcfcfda] p-2 w-50 "
                   />
                   </div>
                  <div>
                     <h3 className="text-[#4B5563]">Bankholder Name</h3>
                   <input
                     name="bankHolderName"
                     value={formData.bankHolderName}
                     onChange={e => handleStaffChange(e)}
                     className="border outline-none border-[#cfcfcfda] p-2 w-50 "
                   />
                   </div>
                  <div>
                     <h3 className="text-[#4B5563]">Branch Name</h3>
                   <input
                     name="BranchName"
                     value={formData.BranchName}
                     onChange={e => handleStaffChange(e)}
                     className="border outline-none border-[#cfcfcfda] p-2 w-50 "
                   />
                   </div>
                   <div>
                     <h3 className="text-[#4B5563]">Idcard Front </h3>
                   <div className="border p-1 overflow-hidden w-50 outline-none rounded border-[#cfcfcfda]">
                   <input
                     type="file"
                     accept="image/*"
                     onChange={e => handlestaffFile(e)}
                     className="mb-2"
                   />
                   </div>
                   </div>
                   <div>
                     <h3 className="text-[#4B5563]">Idcard Back </h3>
                   <div className="border p-1 overflow-hidden w-50 outline-none rounded border-[#cfcfcfda]">
                   <input
                     type="file"
                     accept="image/*"
                     onChange={e => handlestaffFile(e)}
                     className="mb-2"
                   />
                   </div>
                   </div>
                   <div className="flex gap-3 pt-5  w-60 ">
                   <button
                    disabled={CreateStaffArray.isLoading}
                     type="submit"
                     className="cursor-pointer bg-[#20B0A4] text-white px-4 py-2 mr-0 rounded"
                   >
                     {CreateStaffArray.isLoading ? <Loader className="animate-spin"/> : "Add Staff"}
                   </button> 
                   <button
                     onClick={() => setShowstaffForm((prev) => !prev)}
                     type="submit"
                     className="cursor-pointer bg-white text-[#4B5563] border-[#cfcfcfda] border hover:text-[#20B0A4] hover:border-[#20B0A4] transition-all ease-in   px-4 py-2 mr-0 rounded"
                   >
                       Cancel
                   </button> 
                 </div>
                 </form>
               </div>
               </div>
               
         <table className="w-[96.5%] m-5 border-gray-200 border-2 rounded-lg bg-white">
           {/* Table Header */}
           <thead className="bg-white border-b border-gray-300">
             <tr>
               <th className="px-2 py-3 font-semibold text-gray-700">Name</th>
               <th className="px-2 py-3 font-semibold text-gray-700">Father Name</th>
               <th className="px-2 py-3 font-semibold text-gray-700">Designation</th>
               <th className="px-2 py-3 font-semibold text-gray-700">CNIC</th>
               <th className="px-2 py-3 font-semibold text-gray-700">Email</th>
               <th className="px-2 py-3 font-semibold text-gray-700">Account Number</th>
               <th className="px-2 py-3 font-semibold text-gray-700">Gender</th>
               <th className="px-2 py-3 font-semibold text-gray-700 text-right">Actions</th>
             </tr>
           </thead>
     
           {/* Table Body */}
           {FetchStaffsArray.length > 0 ?
           (<tbody className="divide-y divide-gray-200">
             {FetchStaffsArray?.map((p, idx) => (
               <tr key={idx} className="hover:bg-[#E8F7F6] transition-colors">
                 <td className="px-2 py-4 text-sm text-gray-800 font-medium">{p.Name}</td>
                 <td className="px-2 py-4 text-sm text-gray-600">{p.FatherName}</td>
                 <td className="px-2 py-4 text-sm text-gray-600">{p.Designation}</td>
                 <td className="px-2 py-4 text-sm text-gray-600">{p.CNICnumber}</td>
                 <td className="px-2 py-4 text-sm text-gray-600">{p.email}</td>
                 <td className="px-2 py-4 text-sm text-gray-600">{p.AccountNumber}</td>
                 <td className="px-2 py-4 text-sm text-gray-600">{p.Gender}</td>
                 
                 <td className="px-4 py-4 text-right">
                   <div className="flex justify-end gap-3">
                     <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-all">
                       <Edit className="w-4 h-4 text-gray-700" />
                     </button>
                     <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-50 hover:bg-red-100 rounded-md transition-all">
                       <Trash2 className="w-4 h-4 text-red-600" />
                     </button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>)
           :(<tbody>
             <tr>
               <td colSpan={7} className="text-center py-20">Products Not Found</td>
             </tr>
           </tbody>)}
     
               </table>
     
             </div>
             
           </div>
      
    );
  };

  export default Staff;
