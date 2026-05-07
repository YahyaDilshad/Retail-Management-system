import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const newUser = async({
    identifier,
    password,
    role
})=>{
    const user  = await User.create({
        identifier,
        password,       
        role,
    })
    const token = jwt.sign({ id : user.id , role: user.role }, process.env.JWT_SECRET);
    return {user , token};
}