import { DataTypes } from "sequelize";
import { sequelize } from "../config/sql.connnect.js";

export const Category = sequelize.define("Category" , {
     categoryName :{ 
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
},
{
    timeStamp : true,
    updatedAt :  false,
    tableName : "Categories"
})