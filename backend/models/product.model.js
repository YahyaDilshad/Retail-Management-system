import { DataTypes } from "sequelize";
import { sequelize } from "../config/sql.connnect.js";

export const Product = sequelize.define("Product", {
  brandId : {
      type : DataTypes.INTEGER, 
    },
  brandName : DataTypes.STRING,
  Name: DataTypes.STRING,
  Price: DataTypes.STRING,
  Image: DataTypes.TEXT,
  Stock: DataTypes.STRING,
  Description: DataTypes.TEXT,
  Discount: DataTypes.STRING,
},{
  timestamps: true,
  updatedAt : false,
  tableName: 'Products'
}
);