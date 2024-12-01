import express from "express";
import { 
    uploadCourse, 
    editCourse, 
    getAllCourses, 
    getCourse, 
    enrollInCourse, 
    getTeacherCourses, 
    getStudentCourses, 
    deleteCourse 
} from "../controllers/course.controller";
import { isAuthenticated, authoriseRoles } from "../middleware/auth";

const courseRouter = express.Router();

/**
 * @route POST /create-course
 * @desc Create a new course (teachers only)
 * @access Private
 */
courseRouter.post(
    "/create-course",
    isAuthenticated,
    authoriseRoles("teacher"),
    uploadCourse
);

/**
 * @route PUT /edit-course/:id
 * @desc Edit an existing course (only the instructor)
 * @access Private
 */
courseRouter.put(
    "/edit-course/:id",
    isAuthenticated,
    authoriseRoles("teacher"),
    editCourse
);

/**
 * @route GET /get-course/:id
 * @desc Get details of a specific course 
 * @access Public
 */
courseRouter.get("/get-course/:id", getCourse);

/**
 * @route GET /get-courses
 * @desc Get all courses 
 * @access Public
 */
courseRouter.get("/get-courses", getAllCourses);

/**
 * @route GET /teacher/courses
 * @desc Get all courses created by a specific teacher
 * @access Private
 */
courseRouter.get(
    "/teacher/courses",
    isAuthenticated,
    authoriseRoles("teacher"),
    getTeacherCourses
);

/**
 * @route GET /student/courses
 * @desc Get all courses a student is enrolled in
 * @access Private
 */
courseRouter.get(
    "/student/courses",
    isAuthenticated,
    authoriseRoles("student"),
    getStudentCourses
);

/**
 * @route POST /enroll/:id
 * @desc Enroll in a course (students only)
 * @access Private
 */
courseRouter.post(
    "/enroll/:id",
    isAuthenticated,
    authoriseRoles("student"),
    enrollInCourse
);

/**
 * @route DELETE /delete-course/:id
 * @desc Delete a course (admins only)
 * @access Private
 */
courseRouter.delete(
    "/delete-course/:id",
    isAuthenticated,
    authoriseRoles("admin"),
    deleteCourse
);

export default courseRouter;
