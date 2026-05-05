import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const newUser = async({
    username ,
    email,
    password,
    role
})=>{
    const user  = await User.create({
        username,
        email,
        password,       
        role,
    })
if(!user) return console.log("User is not created in user service file")
    const token = jwt.sign({ id : user.id , role: user.role }, process.env.JWT_SECRET);
    return {user , token};
}