import { uploadToCloudinary } from "../config/Cloudinary.js";
import { Staff } from "../models/Staff.model.js";
import { User } from "../models/user.model.js";
import {newStaff} from '../Services/staff.services.js'


export const CreateStaff = async (req, res) => {
  try {
    const {
      Name,
      FatherName,
      Designation,
      CNICnumber,
      MobileNumber,
      Address,
      Gender,
      bankHolderName,
      AccountNumber,
      BranchName,
      userId,
      email
    } = req.body;
    
    
    if (
      !Name || !FatherName || !Designation || !CNICnumber ||
      !MobileNumber || !Address || !Gender ||
      !BranchName || !email ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const StaffExists = await Staff.findOne({ where: { CNICnumber } });
    if (StaffExists) {
      return res.status(400).json({ message: "Staff already exists" });
    }
     
    const fetchUser = await User.findOne({
      where : {email : email},
    })
    console.log('fetch find Email ', fetchUser)
    if(!fetchUser) return res.status(309).send("Use Correct Email for creating staff")
    let frontUrl = "";
    let backUrl = "";

    const frontFile = req.files?.IDFrontImage[0];
    const backFile = req.files?.IDBackImage[0];

    if (frontFile) {
      const uploadedFront = await uploadToCloudinary(frontFile);
      frontUrl = uploadedFront.url;
    }

    if (backFile) {
      const uploadedBack = await uploadToCloudinary(backFile);
      backUrl = uploadedBack.url;
    } 
    const staff = await newStaff({
      Name,
      FatherName,
      Designation,
      CNICnumber,
      MobileNumber,
      Address,
      Gender,
      email: fetchUser.email,
      bankHolderName,
      AccountNumber,
      userId : fetchUser.id,
      BranchName,
      IDFrontImage: frontUrl || '',
      IDBackImage: backUrl || '',
    });
    
    return res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: staff,
    });

  } catch (error) {
    console.error("Error Creating Staff", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteStaff =   async (req, res) => {
  try {
       const {id} = req.params;
    const deleted = await Staff.destroy({
      where : {id : id}
    });
   
    if (!deleted) {
        console.log("Staff Not Found For Deleting this Id (error in controller file)")
        return res.status(404).json({ success: false, message: "Staff not found" });
    }
    
    console.log("Staff Deleted Successfully")
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export const getAllstaffs = async (req, res) => {
  try {
    const { staff, search } = req.query;
    let filter = {};

    if (staff) filter.staff = staff;
    if (search) {
      filter[Op.or] = [
        { name: {[Op.like]: `%${search}%`}},
        { description: {[Op.like] : `%${search}%`} },
      ];
    }

    const staffs = await Staff.findAll({ where: filter })

    res.json({ success: true,  data: staffs });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}