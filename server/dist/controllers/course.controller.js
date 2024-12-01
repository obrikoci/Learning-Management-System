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
exports.deleteCourse = exports.getStudentCourses = exports.getTeacherCourses = exports.getAllCourses = exports.getCourse = exports.enrollInCourse = exports.editCourse = exports.uploadCourse = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const course_model_1 = __importDefault(require("../models/course.model"));
// Upload course (for teachers only)
exports.uploadCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || req.user.role !== "teacher") {
        return next(new ErrorHandler_1.default("Only teachers can create courses", 403));
    }
    const { title, description } = req.body;
    if (!title || !description) {
        return next(new ErrorHandler_1.default("Title and description are required", 400));
    }
    const course = yield course_model_1.default.create({
        title,
        description,
        instructor: req.user._id,
    });
    res.status(201).json({
        success: true,
        course,
    });
}));
// Edit course (for teachers only)
exports.editCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { title, description } = req.body;
    const courseId = req.params.id;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "teacher") {
        return next(new ErrorHandler_1.default("Only teachers can edit courses", 403));
    }
    const course = yield course_model_1.default.findById(courseId);
    if (!course) {
        return next(new ErrorHandler_1.default("Course not found", 404));
    }
    if (course.instructor.toString() !== userId.toString()) {
        return next(new ErrorHandler_1.default("You are not authorized to edit this course", 403));
    }
    course.title = title || course.title;
    course.description = description || course.description;
    yield course.save();
    res.status(200).json({
        success: true,
        course,
    });
}));
// Enroll in course (for students only)
exports.enrollInCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params; // Course ID
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const course = yield course_model_1.default.findById(id);
    if (!course)
        return next(new ErrorHandler_1.default("Course not found", 404));
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "student") {
        return next(new ErrorHandler_1.default("Only students can enroll in courses", 403));
    }
    // Check if already enrolled
    if (course.enrolledStudents.includes(userId)) {
        return res.status(400).json({
            success: false,
            message: "You are already enrolled in this course",
        });
    }
    course.enrolledStudents.push(userId);
    yield course.save();
    res.status(200).json({
        success: true,
        message: "Successfully enrolled in the course",
    });
}));
// Get course details (public access)
exports.getCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.id;
    const course = yield course_model_1.default.findById(courseId)
        .populate("instructor", "name email role")
        .populate("enrolledStudents", "name email");
    if (!course) {
        return next(new ErrorHandler_1.default("Course not found", 404));
    }
    res.status(200).json({
        success: true,
        course,
    });
}));
// Get all courses
exports.getAllCourses = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield course_model_1.default.find()
        .populate("instructor", "name email role");
    res.status(200).json({
        success: true,
        courses,
    });
}));
// Get teacher's courses
exports.getTeacherCourses = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const teacherId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!req.user || req.user.role !== "teacher") {
        return next(new ErrorHandler_1.default("Only teachers can view their courses", 403));
    }
    const courses = yield course_model_1.default.find({ instructor: teacherId });
    res.status(200).json({
        success: true,
        courses,
    });
}));
// Get student's enrolled courses
exports.getStudentCourses = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!req.user || req.user.role !== "student") {
        return next(new ErrorHandler_1.default("Only students can view their enrolled courses", 403));
    }
    const courses = yield course_model_1.default.find({ enrolledStudents: studentId });
    res.status(200).json({
        success: true,
        courses,
    });
}));
// Delete course (for admin only)
exports.deleteCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || req.user.role !== "admin") {
        return next(new ErrorHandler_1.default("Only admins can delete courses", 403));
    }
    const course = yield course_model_1.default.findByIdAndDelete(req.params.id);
    if (!course) {
        return next(new ErrorHandler_1.default("Course not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Course deleted successfully",
    });
}));
