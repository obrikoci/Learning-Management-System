import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db";
import courseRoutes from "./routes/course.route";
import userRoutes from "./routes/user.route";
import { ErrorMiddleware } from "./middleware/error";
import authRoutes from "./routes/authRoutes";

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

// Error Middleware
app.use(ErrorMiddleware);

// Connect to Database and Start Server
// connectDB()
//   .then(() => {
//     const PORT = process.env.PORT || 8080;
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((error) => console.error("Database connection failed:", error));
