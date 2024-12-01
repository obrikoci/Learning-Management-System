import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";

export const refreshAccessToken = (req: Request, res: Response, next: NextFunction): any =>  {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is missing" });
  }

  try {
    const decoded = verifyToken(refreshToken); // Validate the refresh token
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role }, // Payload for new access token
      process.env.JWT_SECRET!, // Use the JWT_SECRET
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE}m` } // Expiration for access token
    );

    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    return next(err); // Pass the error to Express's error handler
  }
};

