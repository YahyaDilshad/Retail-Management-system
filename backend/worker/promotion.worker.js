import { Worker } from "bullmq";
import { sendNotification } from "../services/pushnotification.service";
import { connection } from "../config/Keydb.connection";

new Worker("promotion-Notification",
    async job =>{
    try {
        await sendNotification(job.data.notification)
        console.log("Promotion notification success to send sendNotification() ")
    } catch (error) {
        console.log('Promotion notifiaction failed to send sendNotification()' , error)
    }
    },
    {
        connection,
        concurrency : 8
    }    
)