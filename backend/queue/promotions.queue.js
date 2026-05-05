import { Queue } from "bullmq";
import { connection } from "../config/Keydb.connection.js";

export const promotionQueue = new Queue("promotion-Notification" , {
    connection
})  
