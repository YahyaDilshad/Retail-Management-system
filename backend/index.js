import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import categoryRoutes from "../router/categoryRoute.js";
import brandRoutes from "../router/brandRoute.js";
import productRoutes from "../router/productRoute.js";
import authuser from "../router/userRouter.js";
import staff from "../router/Staff.router.js";

const app = express();

app.use(cookieParser());

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

app.use("/api/auth", authuser);
app.use("/api/products", productRoutes);
app.use("/api/staff", staff);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);

// global error handler (IMPORTANT)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" + err.message });
});

export default app;