import { Worker } from "bullmq";
import NotificationTokenModel from "../models/NotificationToken.model";
import { connection } from "../config/Keydb.connection";
import { getWebSocketServer } from "../config/Websocket.server";

export const notificationWorker = new Worker("notification-queue" ,
async job =>{
    const { notificationId , userId} = job.data;
        const notification = await NotificationTokenModel.findOneAndUpdate({
         _id : notificationId,
         status : 'PENDING'},
        {
            $set:{ status : "PROCESSING"}
        },
        {
            new : true
        }
    )
      if(!notification){
        console.log(`Status cannot update during job working in notification worker file and ${notificationId} not found`)
        return
      }
    // fetch all active socketids(values) from keydb
    const socketKey = `user:${userId}:connectiion`
    const socketIds = await connection.smembers(socketKey) // get all socket ids for All the users who are login in app and have active connection with web socket server  
    
    if(!socketIds || socketIds === 0 ){
        await NotificationTokenModel.findOneAndUpdate(notificationId , {
        status : "PENDING"
        }
    )
    throw new Error(`No active sockets found for user: ${userId} error in notification.worker.js file`);
    }

    const wss = getWebSocketServer();
    let setcount = 0;

    for (const socketId of socketIds){
      const ws = wss.clientsMap.get(socketId)

      if(ws && ws.readyState === 1){ // 1 is for OPEN state of web socket connection
        try {
            ws.send(
                JSON.stringify({
                    type : "NOTIFICATION",
                    data : notification 
        })
        )
        setcount++
        } catch (error) {
            console.log("❌ cannot send notification with web socket")    
        }
      }
      
    }
     if(setcount > 0 ){
        notification.status = "SENT";
        notification.sentAt = new Date().getTime();
        notification.deliveryStatus.websocket.sent = true;
        await notification.save()
        console.log("✅ Stetus update after sending notifiaction from notification")
    }else{
      console.error("❌ Cannot Stetus update after send notifiaction from notification");
    }
},
{
  connection,
  concurrency : 10,
}
) 