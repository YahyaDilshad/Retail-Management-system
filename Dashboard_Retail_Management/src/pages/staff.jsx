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
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showBrandForm, setShowBrandForm] = useState(false);
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
            queryKey : ['Staffs'],
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

    const handleProductFile = (e) => {
    const { name , files} = e.target;
    setFormData((prev) => ({ ...prev , [name] : files[0]}))
    };
    const handleProductChange = (e) => {
      const { name, value } = e.target; // Small letters use karein
      setFormData({ ...formData, [name]: value });
    };

  const handleSubmitProduct = async (e) => {
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
        Name: "", FatherName: "", Designation: "",email : "" , Gender : "" ,BranchName : "" , AccountNumber : "", Address : "" , CNICnumber: "", MobileNumber: "", Address: "", IDBackImage: null,IDFrontImage: ""
      });
      setShowstaffForm(false);
    } catch (error) {
      console.error("Backend Error:", error.response?.data || error.message);
      toast.error("❌ Failed to add Staff");
    }
  };

    // ---------- JSX ----------
    return (
      <div className="w-[80%] top-0 absolute left-64 h-screen">
      <header className="border-b border-[#72727293] bg-white w-full relative">
          <div className="px-6 mt-10 py-5 relative  z-999 flex items-center justify-between bg-white">
            <h1 className="font-bold text-4xl">Staff Management</h1>

            <div className="flex items-center gap-5">
              {/* Add Staff Button */}
              <div
                onClick={() => setShowstaffForm((prev) => !prev)}
                className="btn bg-[#0e6d65] py-2 px-5 flex items-center text-white rounded cursor-pointer gap-2"
              >
                <Plus />
                <button>Create Staff</button>
              </div>
            </div>
          </div>

          {/* ---------- Add Product Form ---------- */}
          <div
            className={`absolute transition-all duration-300 ${
              showstaffForm ? "top-17" : "top-[-400%]"
            } w-full h-100 p-5 rounded-xl bg-[#f8f6f6]`}
          >
            <h1 className="text-xl mb-3">Add New Staff</h1>

            <form
              onSubmit={e => handleSubmitProduct(e)}
              className="py-5 pb-15 w-full rounded relative flex items-center flex-wrap gap-2"
            >
             <div className="mx-3 ">
                <h6 className="text-[14px] text-[#000000a4]" >Full Name</h6   >
              <input
                name="Name"
                placeholder="Product Name"
                value={formData.Name}
                onChange={e => handleProductChange(e)}
                className="border rounded outline-none border-[#000000bb] p-2 w-40 mb-2"
                />
              </div>
              <div className="mx-3">
                <h6 className="text-[14px] text-[#000000a4]" >Father's Name</h6   >
              <input
                name="FatherName"
                placeholder="FatherName"
                value={formData.FatherName}
                onChange={e => handleProductChange(e)}
                className="border rounded outline-none border-[#000000bb] p-2 w-40 mb-2"
              />
              </div>
              <div className="mx-3">
                <h6 className="text-[14px] text-[#000000a4]" >Designation</h6 >
              <input
                name="Designation"
                placeholder="Designation"
                value={formData.Designation}
                onChange={e => handleProductChange(e)}
                className="border rounded outline-none border-[#000000bb] p-2 w-40 mb-2"
              />
              </div>
              <div className="mx-3">
                <h6 className="text-[14px] text-[#000000a4]" >Email</h6   >
              <input
                name="email"
                placeholder="email"
                value={formData.email}
                onChange={e => handleProductChange(e)}
                className="border rounded outline-none border-[#000000bb] p-2 w-40 mb-2"
              />
              </div>
              <div className="mx-3">
                <h6 className="text-[14px] text-[#000000a4]" >CNIC Number</h6   >
              <input
                name="CNICnumber"
                placeholder="CNIC"
                value={formData.CNICnumber}
                onChange={e => handleProductChange(e)}
                className="border rounded outline-none border-[#000000bb] p-2 w-40 mb-2"
              />
              </div>
              <div className="mx-3">
                <h6 className="text-[14px] text-[#000000a4]" >Address</h6 >

              <input
                name="Address"
                placeholder="Address"
                value={formData.Address}
                onChange={e => handleProductChange(e)}
                className="border rounded outline-none border-[#000000bb] p-2 w-40 mb-2"
              />

              </div>
              <div className="mx-3">
                <h6 className="text-[14px] text-[#000000a4]" >Gender </h6 >

              <select
                name="Gender"
                value={formData.Gender}
                onChange={e => handleProductChange(e)}
                className="border p-2 w-40 outline-none rounded border-[#000000bb]"
              >
                <option value="">Select Brand</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              </div>
            <div className="mx-3">
                <h6 className="text-[14px] text-[#000000a4]" >Mobile Number</h6   >
                <input
                name="MobileNumber"
                placeholder="MobileNumber"
                value={formData.MobileNumber}
                onChange={e => handleProductChange(e)}
                className="border outline-none border-[#000000bb] p-2 w-40 "
              />
            </div>
            <div className="mx-3">
                <h6 className="text-[14px] text-[#000000a4]" >Bankholder Name</h6 >

              <input
                name="bankHolderName"
                placeholder="bankHolderName"
                value={formData.bankHolderName}
                onChange={e => handleProductChange(e)}
                className="border outline-none border-[#000000bb] p-2 w-40 "
              />
            </div>
            <div className="mx-3 ">
            <h6 className="text-[14px] text-[#000000a4]" >Account Number</h6  >
            <input
                name="AccountNumber"
                placeholder="AccountNumber"
                value={formData.AccountNumber}
                onChange={e => handleProductChange(e)}
                className="border outline-none border-[#000000bb] p-2 w-40 "
              />
            </div>
            <div className="mx-3">
            <h6 className="text-[14px] text-[#000000a4]" >Branch Name</h6 >
            <input
                name="BranchName"
                placeholder="BranchName"
                value={formData.BranchName}
                onChange={e => handleProductChange(e)}
                className="border outline-none border-[#000000bb] p-2 w-40 "
              />
            </div>
            <div className="mx-3 my-2" >
            <h6 className="text-[14px] text-[#000000a4]" >ID Card FrontImage</h6  >
                  <div className="border p-1 overflow-hidden w-50 outline-none rounded border-[#000000bb]">
              <input
                name="IDFrontImage"
                type="file"
                accept="image/*"
                onChange={e => handleProductFile(e)}
                className="mb-2"
              />
              </div>
            </div>
            <div className="mx-3 my-2">
                <h6 className="text-[14px] text-[#000000a4]" >ID Card BackImage</h6   >
             <div className="border p-1 overflow-hidden w-50 outline-none rounded border-[#000000bb]">
            <input
                name="IDBackImage"
                type="file"
                accept="image/*"
                onChange={e => handleProductFile(e)}
                className="mb-2"
            />
              </div>
            </div>
            <div className="flex items-center justify-center gap-5 mx-3 absolute left-0 bottom-0">
               <button
                type="submit"
                className="cursor-pointer bg-[#0E6D65] text-white px-4 py-2 rounded"
              >
                Add Staff
              </button> 
               <button
               onClick={()=>{
                setShowstaffForm(false)
               }}
                type="submit"
                className="cursor-pointer bg-[#d4d4d4] text-[#000000c4] px-4 py-2 rounded"
              >
                Cancel
              </button> 
            </div>
            </form>
          </div>
        </header>

        {/* ---------- Search Bar ---------- */}
        <header className="border-b border-[#cfcfcfda] px-6 py-5 w-full flex items-center justify-between">
          <input
            type="text"
            value={searchItem}
            placeholder="Search product..."
            onChange={(e) => setSearchItem(e.target.value)}
            className="border outline-none border-[#cfcfcf] p-2 rounded w-[50%]"
          />
        </header>
      <div className="w-full overflow-x-auto shadow-sm rounded-lg border border-gray-200">
    <table className="w-full text-left border-collapse bg-white">
      {/* Table Header */}
      <thead className="bg-gray-100 w-full border-b border-gray-300">
        <tr>
          <th className="px-4 pr-10 py-3 font-semibold text-gray-700">Name</th>
          <th className="px-4 py-3 font-semibold text-gray-700">FatherName</th>
          <th className="px-10 py-3 font-semibold text-gray-700">Designation</th>
          <th className="px-4 py-3 font-semibold text-gray-700">CNIC</th>
          <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
          <th className="px-10 py-3 font-semibold text-gray-700">Address</th>
          <th className="px-4 py-3 font-semibold text-gray-700">BankHolderName</th>
          <th className="px-4 py-3 font-semibold text-gray-700">AccountNumber</th>
          <th className="px-4 py-3 font-semibold text-gray-700">PhoneNmber</th>
          <th className="px-4 py-3 font-semibold text-gray-700 text-right">Action</th>
        </tr>
      </thead>

      {/* Table Body */}
      { FetchStaffsArray.length > 0 ?
      (<tbody className="divide-y divide-gray-200">
        {FetchStaffsArray?.map((p, idx) => (
          <tr key={idx} className="hover:bg-gray-50 transition-colors">
            <td className="px-4 pr-10 py-4 text-sm text-gray-800 font-medium">{p.Name}</td>
            <td className="px-4 py-4 text-sm text-gray-600">{p.FatherName}</td>
            <td className="px-10 py-4 text-sm text-gray-600">{p.Designation?.split(' ').slice(0 , 2).join(" ") + "..."}</td>
            <td className="px-4 py-4 text-sm text-gray-600">{p.email ? p.email : '-'}</td>
            <td className="px-4 py-4 text-sm text-gray-600">{p.CNICnumber ? p.CNICnumber : '-'}</td>
            <td className="px-10 py-4 text-sm text-gray-600">{p.Address?.split(' ').slice(0,2).join(' ') + "..."}</td>
            <td className="px-4 py-4 text-sm text-gray-600">{p.bankHolderName}</td>
            <td className="px-4 py-4 text-sm text-gray-600">{p.AccountNumber}</td>
            <td className="px-4 py-4 text-sm text-gray-600">{p.MobileNumber}</td>

            <td className="px-4 py-4 text-right">
              <div className="flex justify-end gap-3">
                
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
          <td colSpan={7} className="text-center py-20">Staff Not Found</td>
        </tr>
      </tbody>)}

          </table>

        </div>
        
      </div>
      
    );
  };

  export default Staff;
