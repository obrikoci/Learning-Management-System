require('dotenv').config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Define the IUser interface
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'teacher' | 'student' | 'admin';
    isVerified: boolean;
    courses: mongoose.Types.ObjectId[]; // Array of course IDs
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
};

// Define the User schema
const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        validate: {
            validator: function (value: string) {
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
            type: mongoose.Schema.Types.ObjectId, // Reference to Course IDs
            ref: 'Course', // Reference to the Course model
        },
    ],
}, { timestamps: true });

// Middleware to hash password before saving
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate an access token
userSchema.methods.SignAccessToken = function (): string {
    return jwt.sign(
      { id: this._id, role: this.role },
      process.env.ACCESS_TOKEN || "default_access_secret",
      { expiresIn: "5m" }
    );
  };
  
// refresh token
userSchema.methods.SignRefreshToken = function (): string {
    return jwt.sign(
      { id: this._id, role: this.role },
      process.env.REFRESH_TOKEN || "default_refresh_secret",
      { expiresIn: "3d" }
    );
};

// Create the User model
const userModel: Model<IUser> = mongoose.model('User', userSchema);

export default userModel;
