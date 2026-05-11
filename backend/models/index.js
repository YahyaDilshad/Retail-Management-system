import { Product } from "./product.model.js";
import { User } from "./user.model.js";
import { Order } from "./order.model.js";
import { Notification } from "./NotificationToken.model.js";
import { Brand } from "./brand.model.js";
import { Staff } from "./Staff.model.js";
import { Category } from "./Category.model.js";
import { FcmToken } from "./FcmToken.model.js";


User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });
User.hasMany(FcmToken , {foreignKey : "userId"});
FcmToken.belongsTo(User , {foreignKey : "userId"});
Product.hasMany(Order, { foreignKey: "productId" });
Order.belongsTo(Product, { foreignKey: "productId" });
Order.hasMany(Notification, { foreignKey: "orderId" });
Notification.belongsTo(Order, { foreignKey: "orderId" });
Category.hasMany(Brand, { foreignKey: "categoryId" });
Brand.belongsTo(Category, { foreignKey: "categoryId" });
Brand.hasMany(Product, { foreignKey: "brandId" });
Product.belongsTo(Brand, { foreignKey: "brandId" });
User.hasOne(Staff, { foreignKey: "userId" });
Staff.belongsTo(User, { foreignKey: "userId" });


export { Product, User, Order , Staff , Notification , Brand , Category };