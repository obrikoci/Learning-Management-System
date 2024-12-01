"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const error_1 = require("./middleware/error");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL, credentials: true }));
// Routes
exports.app.use("/api/v1/courses", course_route_1.default);
exports.app.use("/api/v1/users", user_route_1.default);
exports.app.use("/api/v1/auth", authRoutes_1.default);
// Error Middleware
exports.app.use(error_1.ErrorMiddleware);

