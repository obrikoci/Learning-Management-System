"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../utils/jwt");
const refreshAccessToken = (req, res, next) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is missing" });
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(refreshToken);
        const newAccessToken = jsonwebtoken_1.default.sign({ id: decoded.id, role: decoded.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE}m` } 
        );
        res.status(200).json({ success: true, accessToken: newAccessToken });
    }
    catch (err) {
        return next(err); 
    }
};
exports.refreshAccessToken = refreshAccessToken;
