"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getAllUsers = exports.getUserCourses = exports.updateUserInfo = exports.getUserInfo = exports.logoutUser = exports.loginUser = exports.activateUser = exports.registrationUser = exports.createActivationToken = void 0;
require('dotenv').config();
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const jwt_1 = require("../utils/jwt");
const redis_1 = require("../utils/redis");
const createActivationToken = (user) => {
    // Generate a 4-digit activation code
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    // Generate a JWT token that includes user data and the activation code
    const token = jsonwebtoken_1.default.sign({ user, activationCode }, process.env.ACTIVATION_SECRET, { expiresIn: "5m" } // Token expires in 5 minutes
    );
    return { token, activationCode };
};
exports.createActivationToken = createActivationToken;
// Register user
exports.registrationUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    // Check if the email already exists
    const isEmailExist = yield user_model_1.default.findOne({ email });
    if (isEmailExist) {
        return next(new ErrorHandler_1.default("This email address has already been registered", 400));
    }
    // Check password length
    if (password.length < 8) {
        return next(new ErrorHandler_1.default("Password must be at least 8 characters long", 400));
    }
    // Generate activation token and activation code
    const { token: activationToken, activationCode } = (0, exports.createActivationToken)({ name, email, password, role });
    try {
        // Render the email template
        const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activation-mail.ejs"), { user: { name }, activationCode, activationToken });
        // Send activation email
        yield (0, sendMail_1.default)({
            email,
            subject: "Activate your account",
            html,
        });
        // Respond to the client
        res.status(201).json({
            success: true,
            message: `Please check your email: ${email} to activate your account.`,
            activationToken,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// Activate user
exports.activateUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { activation_token, activation_code } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
        if (decoded.activationCode !== activation_code) {
            return next(new ErrorHandler_1.default("Invalid activation code", 400));
        }
        const { name, email, password, role } = decoded.user;
        // Check if the email already exists in the database
        const isEmailExist = yield user_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler_1.default("This email address has already been registered", 400));
        }
        // Create the user
        yield user_model_1.default.create({ name, email, password, role, courses: [] });
        const user = yield user_model_1.default.findOne({ email });
        if (user) {
            user.isVerified = true;
            yield user.save();
        }
        res.status(201).json({
            success: true,
            message: "Account activated successfully.",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Invalid or expired activation token", 400));
    }
}));
// Login user
exports.loginUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler_1.default("Invalid email. Please register first.", 404));
    }
    if (!user.isVerified) {
        return next(new ErrorHandler_1.default("Account not verified. Please check your email to activate your account.", 403));
    }
    const isPasswordValid = yield user.comparePassword(password);
    if (!isPasswordValid) {
        return next(new ErrorHandler_1.default("Incorrect password. Try again.", 400));
    }
    (0, jwt_1.sendToken)(user, 200, res);
}));
// Logout user
exports.logoutUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    res.cookie('access_token', '', { maxAge: 1 });
    res.cookie('refresh_token', '', { maxAge: 1 });
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    // Delete session from Redis
    redis_1.redis.del(userId);
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
}));
// Get user info
exports.getUserInfo = (0, catchAsyncErrors_1.CatchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select('-password');
    res.status(200).json({
        success: true,
        user,
    });
}));
exports.updateUserInfo = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const user = yield user_model_1.default.findById(userId);
    if (email && user) {
        const isEmailExist = yield user_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler_1.default("This email already exists", 400));
        }
        user.email = email;
    }
    if (name && user) {
        user.name = name;
    }
    yield (user === null || user === void 0 ? void 0 : user.save());
    res.status(201).json({
        success: true,
        user,
    });
}));
// Get user courses
exports.getUserCourses = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const user = yield user_model_1.default.findById(userId).populate('courses');
    if (!user) {
        return next(new ErrorHandler_1.default('User not found', 404));
    }
    res.status(200).json({
        success: true,
        courses: user.courses,
    });
}));
// get all users
exports.getAllUsers = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find();
    res.status(200).json({
        success: true,
        users,
    });
}));
// delete user
exports.deleteUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findByIdAndDelete(req.params.id);
    if (!user)
        return next(new ErrorHandler_1.default('User not found', 404));
    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    });
}));
