import {Notification} from "../models/NotificationToken.model.js";
import websocket from "ws"

export const sendpendingNotification = async (userId , ws)=>{
try {
  const pending = await  Notification.findAll({
    userId,
    status : "PENDING",
    deliveryStatuswebsocketsent : false,
    expiresAt :{$gt : new Date.now()},
    
  }).sort({createdAt : -1 }).limit(10)

  for(const notification of pending){
    if(ws.readystate === websocket.OPEN){
        ws.send(JSON.stringify({ type : 'NOTIFICATION' , data : notification}))
    }
  }
  Notification.status = "SENT";
  Notification.sentAt = new Date.now();
  Notification.deliveryStatuswebsocketsent = true;
  Notification.afterSave()      
} catch (error) {
  console.log("error in sendpendingNotification()", error)       
}} 