import { DataTypes } from "sequelize";
import { sequelize } from "../config/sql.connnect.js";
export const FcmToken = sequelize.define("FcmToken" , {
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncreament  : true
    },
    userId : {
        type : DataTypes.INTEGER,
    },
    token :{
        type: DataTypes.STRING(500),
        allowNull : false,
        unique : true
    },
    deviceType : {
    type : DataTypes.ENUM('android' , 'ios' , 'web'),
    defaultValue : "web"
    }
},{
    timestamps : true,
    tableName : "FcmTokens"
})