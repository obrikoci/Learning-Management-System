"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
require('dotenv').config();
const redis_1 = require("./redis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Parse environment variables with fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '5', 10); // Default 5 minutes
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '7', 10); // Default 7 days
// Options for cookies
exports.accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
};
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
};
const sendToken = (user, statusCode, res) => {
    try {
        // Debug logs for development
        if (process.env.NODE_ENV !== 'production') {
            console.log("User ID:", user.id);
        }
        const accessToken = user.SignAccessToken();
        const refreshToken = user.SignRefreshToken();
        if (!accessToken || !refreshToken) {
            throw new Error("Failed to generate access or refresh token.");
        }
        // Upload session to Redis
        redis_1.redis.set(user.id, JSON.stringify(user), 'EX', exports.refreshTokenOptions.maxAge / 1000); // Set TTL based on cookie maxAge
        // Apply secure settings for production
        if (process.env.NODE_ENV === "production") {
            exports.accessTokenOptions.secure = true;
            exports.refreshTokenOptions.secure = true;
            exports.accessTokenOptions.sameSite = 'none';
            exports.refreshTokenOptions.sameSite = 'none';
        }
        // Set cookies for tokens
        res.cookie("access_token", accessToken, exports.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
        // Send response
        res.status(statusCode).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
        });
    }
    catch (error) {
        console.error("Error in sendToken:", error.message || error);
        res.status(500).json({ success: false, message: "Failed to send token." });
    }
};
exports.sendToken = sendToken;
// Utility function to verify a token
const verifyToken = (token) => {
    try {
        // Verify the token with the secret key
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decoded; // Return the decoded token payload
    }
    catch (error) {
        throw new Error("Invalid or expired token");
    }
};
exports.verifyToken = verifyToken;
