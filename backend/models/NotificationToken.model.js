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
    type: DataTypes.STRING
  },
  NotificationType: {
    type: DataTypes.STRING
  },
  deliveryStatuswebsocketsent: {
    type: DataTypes.BOOLEAN
  },
  expiresAt: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  updatedAt: false,
  tableName : 'Notifications'
});