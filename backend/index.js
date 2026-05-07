import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import categoryRoutes from "./router/categoryRoute.js";
import brandRoutes from "./router/brandRoute.js";
import productRoutes from "./router/productRoute.js";
import authuser from "./router/userRouter.js";
import staff from "./router/Staff.router.js";

const app = express();

app.use(cookieParser());

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || origin.includes("vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials : true
// }))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ status: "Backend running successfully on Railway" });
});

app.use("/api/auth", authuser);
app.use("/api/products", productRoutes);
app.use("/api/staff", staff);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error: " + err.message });
});

// >>> RAILWAY KE LIYE YEH PORT SETTING LAZMI HAI <<<
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
