import express from "express";
import { 
    activateUser, 
    loginUser, 
    logoutUser, 
    registrationUser, 
    updateUserInfo, 
    getUserInfo,
    getAllUsers,
    deleteUser
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { isAdmin } from "../middleware/auth";
import { deleteCourse, getAllCourses } from "../controllers/course.controller";

const userRouter = express.Router();

/**
 * @route POST /registration
 * @desc Register a new user
 * @access Public
 */
userRouter.post(
    '/registration',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    ],
    validate,
    registrationUser
);

/**
 * @route POST /activate-user
 * @desc Activate a user account
 * @access Public
 */
userRouter.post('/activate-user', activateUser);

/**
 * @route POST /login
 * @desc Log in a user
 * @access Public
 */
userRouter.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    validate,
    loginUser
);

/**
 * @route POST /logout
 * @desc Log out the authenticated user
 * @access Private
 */
userRouter.post('/logout', isAuthenticated, logoutUser);

/**
 * @route PUT /update-info
 * @desc Update user information
 * @access Private
 */
userRouter.put('/update-info', isAuthenticated, updateUserInfo);

/**
 * @route GET /me
 * @desc Get authenticated user's information
 * @access Private
 */
userRouter.get('/me', isAuthenticated, getUserInfo);

userRouter.get('/admin/users', isAuthenticated, isAdmin, getAllUsers);
userRouter.delete('/admin/user/:id', isAuthenticated, isAdmin, deleteUser);

userRouter.get('/admin/courses', isAuthenticated, isAdmin, getAllCourses);
userRouter.delete('/admin/course/:id', isAuthenticated, isAdmin, deleteCourse);


export default userRouter;
