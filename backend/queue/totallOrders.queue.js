import { Queue } from "bullmq";
import { connection } from "../config/Keydb.connection.js";

export const totalOrdersQueue = new Queue("total-orders-queue", {
    connection
})