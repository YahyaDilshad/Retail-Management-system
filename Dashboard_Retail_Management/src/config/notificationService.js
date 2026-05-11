import { getToken } from "firebase/messaging";
import { messaging } from "./firebaseConfig.js";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../lib/axios.js";

export const requestNotificationPermissionAndgetToken = async (userId) =>{
    try {
        console.log('🔄 Requesting notification permission')

        const permission = await Notification.requestPermission();
        if(permission === "granted"){
            console.log("Notification permission granted")
         const token = await getToken(messaging , {
            vapidKey : import.meta.env.VITE_FIREBASE_VAPID_KEY
         })    
         if(token){
            console.log('👍 token generated succesfully')
           const res = await axiosInstance.post("/notification/register-token" ,  {
            token : token ,
            userId : userId,
            deviceType : "web"
           })
          console.log("token send to backend" , res.data)
         }
        }
    } catch (error) {
        console.error('❌ Error requesting notification permission:', error)
    }
}