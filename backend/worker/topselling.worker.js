import { Job } from "bullmq";
import { topSellingProducts } from "../queue/topselling.queue";

topsellingproducts.process(async()=>{
    const items = Job.data.items

    for(const item of items){
        await topsellingproducts.updateOne(
         { productsId : item.productsId},
         {$inc : {totalSoldItem : item.quantity}},
         {  upsert : true}
        )
    }
});