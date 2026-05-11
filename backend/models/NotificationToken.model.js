import { sequelize } from "../config/sql.connnect.js";
import { DataTypes } from "sequelize";

export const Notification = sequelize.define("Notification", {
  orderId :{
    type : DataTypes.INTEGER,
  },
  
  Title: {
    type: DataTypes.STRING
  },
  Message: {
    type: DataTypes.STRING
  },
  ImageUrl: {
    type: DataTypes.STRING,
    defaultValue : null
  },
  NotificationType: {
    type: DataTypes.ENUM("login_alert"  , "logout_alert", "Promotion" , "Order_Recommendation" , "Product_Recommendation"),
    defaultValue : "Promotion"
  },
  deliveryStatuswebsocketsent: {
    type: DataTypes.BOOLEAN,
    defaultValue : false
  },
  expiresAt: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  updatedAt: false,
  tableName : 'Notifications'
});