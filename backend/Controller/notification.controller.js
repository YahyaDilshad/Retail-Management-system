import { sendNotification } from "../config/firebaseconfig.js";
import { Notification } from "../models/NotificationToken.model.js";
import { FcmToken } from "../models/FcmToken.model.js"

export const createNotification = async (template) =>{
    try {
    const notifiaction = await Notification.create({
        orderId : template.orderId || null,
        Title : template.title || "New Notification",
        Message : template.message || "You have a new notification",
        NotificationType : template.NotificationType ,
    })
    
    // get fcm token for user 
    const fcmtoken = await FcmToken.findOne({ where : { userId : template.userId}})
    if(fcmtoken && fcmtoken.token.length > 0){
        fcmtoken.forEach(async (device) => {
          const sendnotify = await sendNotification(fcmtoken.token , template)
          console.log("send notification to fcm config success full")
          if(!sendnotify.success && (sendnotify.error.includes("not-registered") || sendnotify.error.includes("invalid"))) {
            // Handle invalid or unregistered FCM token
            await FcmToken.destroy({where : { token : fcmtoken.token }})
            console.log("invalid token removed from database")
          }
        })
    }  
    } catch (error) {
        console.error("Error creating notification:", error.message);
        throw error;
    }
}