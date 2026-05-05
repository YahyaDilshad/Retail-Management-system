import { Queue } from "bullmq";
import { connection } from "../config/Keydb.connection.js";

export const OrderQueue = new Queue("orders-queue" , {
    connection
})