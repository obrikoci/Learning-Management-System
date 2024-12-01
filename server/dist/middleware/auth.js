"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authoriseRoles = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
// Authenticate user middleware
const isAuthenticated = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return next(new ErrorHandler_1.default("Authentication token is missing", 401));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next(); // Move to the next middleware or route handler
    }
    catch (err) {
        next(new ErrorHandler_1.default("Invalid or expired token", 401));
    }
};
exports.isAuthenticated = isAuthenticated;
// Authorize roles middleware
const authoriseRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return next(new ErrorHandler_1.default("You do not have permission to access this resource", 403));
    }
    next();
};
exports.authoriseRoles = authoriseRoles;
// Check admin role middleware
const isAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
        return next(new ErrorHandler_1.default("Access denied. Admins only.", 403));
    }
    next();
};
exports.isAdmin = isAdmin;
