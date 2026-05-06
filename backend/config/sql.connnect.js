import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
// Agar DATABASE_URL mojood hai to wo use kare, warna local settings
export const sequelize = process.env.DB_URI 
  ? new Sequelize(process.env.DB_URI, {
      dialect: "mysql",
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false}
      }
    })
  : new Sequelize(
      process.env.DB_NAME || 'retail_db',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '17seventeen.',
      {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
        logging: false
      }
    );

  console.log("DB_USER" , process.env.DB_USER)
  console.log("DB_PASSWORD" , process.env.DB_PASSWORD)
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB Connected");
    // await sequelize.query("SET FOREiGN_KEY_CHECKS = 0")
    await sequelize.sync();
    // await sequelize.query("SET FOREiGN_KEY_CHECKS = 1")
    console.log("Tables Created");
  } catch (err) {
    console.error(err);
  }
};

start();
