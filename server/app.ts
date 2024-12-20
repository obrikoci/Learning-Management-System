import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db";
import courseRoutes from "./routes/course.route";
import userRoutes from "./routes/user.route";
import { ErrorMiddleware } from "./middleware/error";
import authRoutes from "./routes/authRoutes";
import path = require("path");

dotenv.config();

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Add the test route before your other routes or in your routes file
app.post('/api/v1/test', (req, res) => {
  res.status(200).json({ message: 'Backend is working!' });
});

// Routes
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error Middleware
app.use(ErrorMiddleware);

