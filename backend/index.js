    import dotenv from "dotenv";
    import path from 'path';
    import { fileURLToPath } from 'url';
    import http from 'http'

    dotenv.config(); 
//    import { initWebSocketServer } from "./config/Websocket.server.js";
  //  import { handleWebsocketConnection } from "./handler/websocket.handler.js";
    import { sequelize } from "./config/sql.connnect.js";
    import "./models/index.js";
    
    import express from "express";
    const app = express()
    import cookieParser from 'cookie-parser'
    import cors from "cors";
  
    
    import categoryRoutes from './router/categoryRoute.js'
    import brandRoutes from "./router/brandRoute.js";              
    import productRoutes from "./router/productRoute.js";
    import authuser from './router/userRouter.js'
    import staff from './router/Staff.router.js'
  
    // create server with http module
    const Server = http.createServer(app)
    
    
    
    // const wss = initWebSocketServer(Server)
    // wss.on("connection" , ()=> {
    // handleWebsocketConnection(ws, req, wss)
    // })

    app.use(cookieParser())
    app.use(cors({
      origin: true,
      credentials: true
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); //

    app.use("/api/auth", authuser);
    app.use("/api/products", productRoutes);
    app.use("/api/staff" , staff)
    app.use("/api/categories", categoryRoutes);
    app.use("/api/brands", brandRoutes);


const PORT = process.env.PORT || 5000;
    



export default app


