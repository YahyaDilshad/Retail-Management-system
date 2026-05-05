import { DataTypes } from "sequelize";
import { sequelize } from "../config/sql.connnect.js";

export const Staff =  sequelize.define("Staff" , {
    userId :{
        type : DataTypes.INTEGER,
    },
    Name : {
        type : DataTypes.STRING
    },
    FatherName : {
        type : DataTypes.STRING

    },
    email :{
    type : DataTypes.STRING
    },
    Designation : {
        type : DataTypes.STRING
    },
    CNICnumber :{
        type : DataTypes.STRING
    },
    MobileNumber : {
        type : DataTypes.STRING
    },
    Address : {
        type : DataTypes.STRING
    },
    Gender :{
        type: DataTypes.ENUM("Male" ,"Female"),
        allowNull : false,
        defaultValue : "Male"
    },
    bankHolderName :{
        type : DataTypes.STRING
    },
    AccountNumber :{    
        type : DataTypes.STRING
    },
    BranchName :{
        type: DataTypes.STRING
    },
    IdCardFrontImage: {
      type: DataTypes.STRING
    },
    IdCardBackImage: {
      type: DataTypes.STRING
    },  
    

  },{
  timestamps: true,
  updatedAt : false,
  tableName: 'Staffs'
})