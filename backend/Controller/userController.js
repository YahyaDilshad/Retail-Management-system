import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {User} from "../models/user.model.js";
import { newUser } from "../Services/user.service.js";
import { validationResult } from "express-validator";
import { Op } from "sequelize";



export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password, role } = req.body;
     
    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const {user , token} = await newUser({
      username,
      email,
      password: hashed,
      role,
    });
    
    res.cookie("token", token ,{
      httpOnly : true,
      secure : process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development",
      sameSite : "strict",
    })
    console.log("User registered successfully:", user)
    return res.status(201).json({ success: true, message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    console.log("User registered error:", err.message)
    return res.status(500).json({ success: false, message: err.message });
  }
};
// Login handler
export const loginUser = async (req, res) => {
  try {
       const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { identifier, password } = req.body;
    
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.cookie("token" , token ,{
     httpOnly : true,
     secure : false,
     sameSite : 'lax',
     maxAge : 7 * 24 * 60 * 60 * 1000 // cookie expire 7 days
    })
    return res.json({
      success: true,
      token,
      user
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Logout handler
export const logout = (req, res) => {
  res.clearCookie("token");
  console.log("Logout Successfull")
  return res.json({ success: true, message: "Logout successfully" });
  
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
