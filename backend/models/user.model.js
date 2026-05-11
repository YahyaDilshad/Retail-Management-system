import { DataTypes } from "sequelize";
import { sequelize } from "../config/sql.connnect.js";


export const User = sequelize.define("User", {
  username: DataTypes.STRING || "",
  email : DataTypes.STRING || "",
  password: DataTypes.STRING,
  role: {
  type: DataTypes.ENUM("admin", "user"),
  allowNull: false,
  defaultValue: "user"
} 
},{
  timestamps: true,
  updatedAt : false,
  tableName: 'Users'
});