import { Queue } from "bullmq";
import { connection } from "../config/Keydb.connection.js";

export const notification_Queue = new Queue("notification-queue",{
  connection
}) 
