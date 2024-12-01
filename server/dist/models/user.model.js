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
require('dotenv').config();
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
;
// Define the User schema
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        validate: {
            validator: function (value) {
                return emailRegexPattern.test(value);
            },
            message: 'Please enter a valid email',
        },
        unique: true,
    },
    password: {
        type: String,
        minlength: [8, 'Password must be at least 8 characters'],
        required: [true, 'Please enter your password'],
        select: false,
    },
    role: {
        type: String,
        enum: ['teacher', 'student', 'admin'],
        required: [true, 'Please specify a role (teacher or student)'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId, // Reference to Course IDs
            ref: 'Course', // Reference to the Course model
        },
    ],
}, { timestamps: true });
// Middleware to hash password before saving
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return next();
        }
        this.password = yield bcryptjs_1.default.hash(this.password, 10);
        next();
    });
});
// Method to compare passwords
userSchema.methods.comparePassword = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(enteredPassword, this.password);
    });
};
// Method to generate an access token
userSchema.methods.SignAccessToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id, role: this.role }, process.env.ACCESS_TOKEN || "default_access_secret", { expiresIn: "5m" });
};
// refresh token
userSchema.methods.SignRefreshToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id, role: this.role }, process.env.REFRESH_TOKEN || "default_refresh_secret", { expiresIn: "3d" });
};
// Create the User model
const userModel = mongoose_1.default.model('User', userSchema);
exports.default = userModel;
