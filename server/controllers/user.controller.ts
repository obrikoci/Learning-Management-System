require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";

// activation token
interface IActivationToken {
    token: string;
    activationCode: string;
  }
  
  export const createActivationToken = (user: { name: string; email: string; password: string; role: string }): IActivationToken => {
    // Generate a 4-digit activation code
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  
    // Generate a JWT token that includes user data and the activation code
    const token = jwt.sign(
      { user, activationCode },
      process.env.ACTIVATION_SECRET as Secret,
      { expiresIn: "5m" } // Token expires in 5 minutes
    );
  
    return { token, activationCode };
  };

// Register user
export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;
  
    // Check if the email already exists
    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return next(new ErrorHandler("This email address has already been registered", 400));
    }
  
    // Check password length
    if (password.length < 8) {
      return next(new ErrorHandler("Password must be at least 8 characters long", 400));
    }
  
    // Generate activation token and activation code
    const { token: activationToken, activationCode } = createActivationToken({ name, email, password, role });
  
    try {
      // Render the email template
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        { user: { name }, activationCode, activationToken }
      );
  
      // Send activation email
      await sendMail({
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
  

// Activate user
export const activateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { activation_token, activation_code } = req.body;
  
    try {
      const decoded = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: { name: string; email: string; password: string; role: string }; activationCode: string };
  
      if (decoded.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
  
      const { name, email, password, role } = decoded.user;
  
      // Check if the email already exists in the database
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("This email address has already been registered", 400));
      }
  
      // Create the user
      await userModel.create({ name, email, password, role, courses: [] });
      const user = await userModel.findOne({email});
      if (user) {
        user.isVerified = true;
        await user.save();
      }

      res.status(201).json({
        success: true,
        message: "Account activated successfully.",
      });
    } catch (error: any) {
      return next(new ErrorHandler("Invalid or expired activation token", 400));
    }
  });
  

// Login user
export const loginUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  console.log(123)
    const { email, password } = req.body;
  
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email. Please register first.", 404));
    }
  
    if (!user.isVerified) {
      return next(new ErrorHandler("Account not verified. Please check your email to activate your account.", 403));
    }
  
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ErrorHandler("Incorrect password. Try again.", 400));
    }
  
    sendToken(user, 200, res);
  });
  


// Logout user
export const logoutUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('access_token', '', { maxAge: 1 });
    res.cookie('refresh_token', '', { maxAge: 1 });

    const userId = req.user?._id as string;

    // Delete session from Redis
    redis.del(userId);

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
});

// Get user info
export const getUserInfo = CatchAsyncError(async (req: Request, res: Response) => {
  // console.log(req.user.id)
    const user = await userModel.findById(req.user?.id).select('-password');
    res.status(200).json({
        success: true,
        user,
    });
});

// Update user info
interface IUpdateUserInfo {
    name?: string;
    email?: string;
}

export const updateUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body as IUpdateUserInfo;
    const userId = req.user?._id as string;
    const user = await userModel.findById(userId);

    if (email && user) {
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler("This email already exists", 400));
        }
        user.email = email;
    }

    if (name && user) {
        user.name = name;
    }

    await user?.save();

    res.status(201).json({
        success: true,
        user,
    });
});

// Get user courses
export const getUserCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id as string;
    const user = await userModel.findById(userId).populate('courses');

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
        success: true,
        courses: user.courses,
    });
});

// get all users
export const getAllUsers = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const users = await userModel.find();
    res.status(200).json({
        success: true,
        users,
    });
});

// delete user
export const deleteUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) return next(new ErrorHandler('User not found', 404));
    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    });
});

