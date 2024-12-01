import { app } from "./app";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./utils/db";
require("dotenv").config();

// Validate required environment variables
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_SECRET_KEY || !process.env.PORT) {
    console.error("Missing required environment variables.");
    process.exit(1);
}

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.message);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    process.exit(1);
});

// Initialize the server and database connection
(async () => {
    try {
        await connectDB(); 
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (err: any) {
        console.error("Failed to start the server:", err.message);
        process.exit(1);
    }
})();
