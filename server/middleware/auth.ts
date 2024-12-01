import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler";
import userModel, { IUser } from "../models/user.model";
import mongoose from "mongoose";

// Define decoded token type
interface DecodedToken extends JwtPayload {
  id: string;
  role?: string;
}

// Authenticate user middleware

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new ErrorHandler("Authentication token is missing", 401));
    }
  
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN!);
      req.user = decoded as IUser; 
      next(); 
    } catch (err) {
      next(new ErrorHandler("Invalid or expired token", 401));
    }
  };

// Authorize roles middleware
export const authoriseRoles = (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ErrorHandler("You do not have permission to access this resource", 403));
  }
  next();
};

// Check admin role middleware
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return next(new ErrorHandler("Access denied. Admins only.", 403));
  }
  next();
};
