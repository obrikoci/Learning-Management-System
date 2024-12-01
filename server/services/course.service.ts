import CourseModel from "../models/course.model";
import { ICourse } from "../models/course.model";
import userModel from "../models/user.model";
import mongoose from "mongoose";

export const createCourseAndAddToTeacher = async (courseData: any, teacherId: mongoose.Types.ObjectId) => {
    // Create the course
    const course = await CourseModel.create({ ...courseData, instructor: teacherId });

    // Add course to teacher's course list
    await userModel.findByIdAndUpdate(
        teacherId,
        { $push: { courses: course._id } },
        { new: true, useFindAndModify: false }
    );

    return course;
};


