import { Queue } from "bullmq";
import { connection } from "../config/Keydb.connection";

export const topSellingProducts = new Queue("top-selling-products" , {
    connection
})