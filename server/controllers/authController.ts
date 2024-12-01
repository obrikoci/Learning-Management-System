import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";

export const refreshAccessToken = (req: Request, res: Response, next: NextFunction): any =>  {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is missing" });
  }

  try {
    const decoded = verifyToken(refreshToken); 
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role }, 
      process.env.JWT_SECRET!, 
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE}m` } 
    );

    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    return next(err); 
  }
};

