import express from "express";
import { FcmToken } from "../models/FcmToken.model.js";
import { protect } from "../middleware/auth.js";
import { Notification } from "../models/NotificationToken.model.js";

const router = express.Router();

router.post('/register-token' ,protect, async (req , res) =>{
    try {
     const {token , deviceType , userId} = req.body;
   if(!token)return console.log("cannot get recieve token from frontend")
    const {fcmtoken , created} = await FcmToken.findOrCreate({
        where : { token : token},
        defaults : {
            userId : userId,
            deviceType : deviceType || "web",
        }
    })
    if(!created){
        // token alraedy exist in database
        await fcmtoken.update({ userId : userId , deviceType : deviceType || "web"})
    }
    res.status(200).json({
        success: true,
        message : created ? "Token registered successfully" : "Token already exist , update user and device type if needed",
        data : fcmtoken
    })   
    } catch (error) {
        console.error("Error registering FCM token:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})
router.get('/' , async (req , res)=>{
    try {
        const FCMtoken = await FcmToken.findAll();
        
       const notification = await Notification.findAll()
       console.log(notification)
       res.status(200).json({
        success : true,
        data : notification,
       })
    } catch (error) {
        console.log("error to get notification" , error.message)
        res.status(500).json({
            success : false,
            message : "Internal server Error during fetching notification"
        })
    }
})

export default router;