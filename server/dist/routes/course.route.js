"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("../controllers/course.controller");
const auth_1 = require("../middleware/auth");
const courseRouter = express_1.default.Router();
/**
 * @route POST /create-course
 * @desc Create a new course (teachers only)
 * @access Private
 */
courseRouter.post("/create-course", auth_1.isAuthenticated, (0, auth_1.authoriseRoles)("teacher"), course_controller_1.uploadCourse);
/**
 * @route PUT /edit-course/:id
 * @desc Edit an existing course (only the instructor)
 * @access Private
 */
courseRouter.put("/edit-course/:id", auth_1.isAuthenticated, (0, auth_1.authoriseRoles)("teacher"), course_controller_1.editCourse);
/**
 * @route GET /get-course/:id
 * @desc Get details of a specific course (public access)
 * @access Public
 */
courseRouter.get("/get-course/:id", course_controller_1.getCourse);
/**
 * @route GET /get-courses
 * @desc Get all courses (public access)
 * @access Public
 */
courseRouter.get("/get-courses", course_controller_1.getAllCourses);
/**
 * @route GET /teacher/courses
 * @desc Get all courses created by a specific teacher
 * @access Private
 */
courseRouter.get("/teacher/courses", auth_1.isAuthenticated, (0, auth_1.authoriseRoles)("teacher"), course_controller_1.getTeacherCourses);
/**
 * @route GET /student/courses
 * @desc Get all courses a student is enrolled in
 * @access Private
 */
courseRouter.get("/student/courses", auth_1.isAuthenticated, (0, auth_1.authoriseRoles)("student"), course_controller_1.getStudentCourses);
/**
 * @route POST /enroll/:id
 * @desc Enroll in a course (students only)
 * @access Private
 */
courseRouter.post("/enroll/:id", auth_1.isAuthenticated, (0, auth_1.authoriseRoles)("student"), course_controller_1.enrollInCourse);
/**
 * @route DELETE /delete-course/:id
 * @desc Delete a course (admins only)
 * @access Private
 */
courseRouter.delete("/delete-course/:id", auth_1.isAuthenticated, (0, auth_1.authoriseRoles)("admin"), course_controller_1.deleteCourse);
exports.default = courseRouter;
