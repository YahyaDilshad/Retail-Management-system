import { DataTypes } from "sequelize";
import { sequelize } from "../config/sql.connnect.js";


export const Order = sequelize.define("Order", {
  userId : {
    type : DataTypes.INTEGER,
  },
  productId :{
   type : DataTypes.INTEGER,
   references : {
      model : "Products",
      key : 'id'
  } 
  },
  deliverAddress : {
    type : DataTypes.STRING
  },
  totalAmount: DataTypes.INTEGER,
  TotalItems : DataTypes.INTEGER

},{
  timestamps: true,
  updatedAt : false,
  tableName: 'Orders'
});