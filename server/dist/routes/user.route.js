"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const validate_1 = require("../middleware/validate");
const auth_2 = require("../middleware/auth");
const course_controller_1 = require("../controllers/course.controller");
const userRouter = express_1.default.Router();
/**
 * @route POST /registration
 * @desc Register a new user
 * @access Public
 */
userRouter.post('/registration', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
], validate_1.validate, user_controller_1.registrationUser);
/**
 * @route POST /activate-user
 * @desc Activate a user account
 * @access Public
 */
userRouter.post('/activate-user', user_controller_1.activateUser);
/**
 * @route POST /login
 * @desc Log in a user
 * @access Public
 */
userRouter.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
], validate_1.validate, user_controller_1.loginUser);
/**
 * @route POST /logout
 * @desc Log out the authenticated user
 * @access Private
 */
userRouter.post('/logout', auth_1.isAuthenticated, user_controller_1.logoutUser);
/**
 * @route PUT /update-info
 * @desc Update user information
 * @access Private
 */
userRouter.put('/update-info', auth_1.isAuthenticated, user_controller_1.updateUserInfo);
/**
 * @route GET /me
 * @desc Get authenticated user's information
 * @access Private
 */
userRouter.get('/me', auth_1.isAuthenticated, user_controller_1.getUserInfo);
userRouter.get('/admin/users', auth_1.isAuthenticated, auth_2.isAdmin, user_controller_1.getAllUsers);
userRouter.delete('/admin/user/:id', auth_1.isAuthenticated, auth_2.isAdmin, user_controller_1.deleteUser);
userRouter.get('/admin/courses', auth_1.isAuthenticated, auth_2.isAdmin, course_controller_1.getAllCourses);
userRouter.delete('/admin/course/:id', auth_1.isAuthenticated, auth_2.isAdmin, course_controller_1.deleteCourse);
exports.default = userRouter;
