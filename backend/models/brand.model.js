import { DataTypes } from "sequelize";
import { sequelize } from "../config/sql.connnect.js";

export const  Brand = sequelize.define("brand" , {
  categoryId:{
     type : DataTypes.INTEGER,      
  },
  categoryName :{
    type : DataTypes.STRING,
  },       
  brandName : DataTypes.STRING,
  Image:{ 
    type : DataTypes.TEXT
  },
},{
    timestamps: true,
    updatedAt : false,
    tableName: 'brands' 
  }
)