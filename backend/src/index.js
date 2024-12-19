import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./libs/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// built-in middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost: 5173", credentials: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started on PORT: ${PORT}\nhttp://localhost:5000"`);
});
