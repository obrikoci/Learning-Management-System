import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel from "../models/course.model";
import mongoose from "mongoose";

// Upload course (for teachers only)
export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "teacher") {
        return next(new ErrorHandler("Only teachers can create courses", 403));
    }

    const { title, description } = req.body;

    if (!title || !description) {
        return next(new ErrorHandler("Title and description are required", 400));
    }

    const course = await CourseModel.create({
        title,
        description,
        instructor: req.user.id,
    });

    res.status(201).json({
        success: true,
        course,
    });
});
  
// Edit course (for teachers only)
export const editCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { title, description } = req.body;
    const courseId = req.params.id;
    const userId = req.user?.id as mongoose.Types.ObjectId;

    if (req.user?.role !== "teacher") {
        return next(new ErrorHandler("Only teachers can edit courses", 403));
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new ErrorHandler("Course not found", 404));
    }

    if (course.instructor.toString() !== userId.toString()) {
        return next(new ErrorHandler("You are not authorized to edit this course", 403));
    }

    course.title = title || course.title;
    course.description = description || course.description;

    await course.save();

    res.status(200).json({
        success: true,
        course,
    });
});

// Enroll in course (for students only)
export const enrollInCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; // Course ID
    const userId = req.user?._id as mongoose.Types.ObjectId;

    const course = await CourseModel.findById(id);
    if (!course) return next(new ErrorHandler("Course not found", 404));

    if (req.user?.role !== "student") {
        return next(new ErrorHandler("Only students can enroll in courses", 403));
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(userId)) {
        return res.status(400).json({
            success: false,
            message: "You are already enrolled in this course",
        });
    }

    course.enrolledStudents.push(userId);
    await course.save();

    res.status(200).json({
        success: true,
        message: "Successfully enrolled in the course",
    });
});


// Get course details (public access)
export const getCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;

    const course = await CourseModel.findById(courseId)
        .populate("instructor", "name email role")
        .populate("enrolledStudents", "name email");

    if (!course) {
        return next(new ErrorHandler("Course not found", 404));
    }

    res.status(200).json({
        success: true,
        course,
    });
});

// Get all courses
export const getAllCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const courses = await CourseModel.find()
        .populate("instructor", "name email role");

    res.status(200).json({
        success: true,
        courses,
    });
});

// Get teacher's courses
export const getTeacherCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const teacherId = req.user?._id;

    if (!req.user || req.user.role !== "teacher") {
        return next(new ErrorHandler("Only teachers can view their courses", 403));
    }

    const courses = await CourseModel.find({ instructor: teacherId });

    res.status(200).json({
        success: true,
        courses,
    });
});

// Get student's enrolled courses
export const getStudentCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const studentId = req.user?._id;

    if (!req.user || req.user.role !== "student") {
        return next(new ErrorHandler("Only students can view their enrolled courses", 403));
    }

    const courses = await CourseModel.find({ enrolledStudents: studentId });

    res.status(200).json({
        success: true,
        courses,
    });
});

// Delete course (for admin only)
export const deleteCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "admin") {
        return next(new ErrorHandler("Only admins can delete courses", 403));
    }

    const course = await CourseModel.findByIdAndDelete(req.params.id);
    if (!course) {
        return next(new ErrorHandler("Course not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Course deleted successfully",
    });
});