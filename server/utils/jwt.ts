require('dotenv').config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";
import jwt, { JwtPayload } from "jsonwebtoken";
import cookieParser from "cookie-parser";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | 'none' | undefined;
  secure?: boolean;
}

// Parse environment variables with fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '5', 10); // Default 5 minutes
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '7', 10); // Default 7 days

// Options for cookies
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
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
    redis.set(user.id, JSON.stringify(user), 'EX', refreshTokenOptions.maxAge / 1000); // Set TTL based on cookie maxAge

    // Apply secure settings for production
    if (process.env.NODE_ENV === "production") {
      accessTokenOptions.secure = true;
      refreshTokenOptions.secure = true;
      accessTokenOptions.sameSite = 'none';
      refreshTokenOptions.sameSite = 'none';
    }

    // Set cookies for tokens
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

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
  } catch (error: any) {
    console.error("Error in sendToken:", error.message || error);
    res.status(500).json({ success: false, message: "Failed to send token." });
  }
};


interface DecodedToken extends JwtPayload {
  id: string;
  role?: string;
}

// Utility function to verify a token
export const verifyToken = (token: string): DecodedToken => {
  try {
    // Verify the token with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return decoded; // Return the decoded token payload
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
