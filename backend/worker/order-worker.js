import { Worker } from "bullmq";
import { connection } from "../config/Keydb.connection.js";
import { sendNotification } from "../config/firebaseconfig.js";

 new Worker("orders-queue" , 
    async job =>{
        await sendNotification(job.data.notification)        
    },
    {
     connection,
     concurrency : 8 // worker can process 8 job at a time 
    }   
     
);
