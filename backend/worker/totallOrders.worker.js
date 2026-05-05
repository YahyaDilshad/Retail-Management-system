import { connection } from "../config/Keydb.connection";
import { Worker } from "bullmq";
import { getAllOrders } from "../controllers/orderController";

new Worker(
    'total-orders-queue',
    async job =>{
       await getAllOrders(job.data.req , job.data.res),
       console.log("Total Orders Worker executed successfully") 
    },{
        connection,
        concurrency: 1 // process one job at a time 
    }
)