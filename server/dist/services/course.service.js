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
exports.createCourseAndAddToTeacher = void 0;
const course_model_1 = __importDefault(require("../models/course.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const createCourseAndAddToTeacher = (courseData, teacherId) => __awaiter(void 0, void 0, void 0, function* () {
    // Create the course
    const course = yield course_model_1.default.create(Object.assign(Object.assign({}, courseData), { instructor: teacherId }));
    // Add course to teacher's course list
    yield user_model_1.default.findByIdAndUpdate(teacherId, { $push: { courses: course._id } }, { new: true, useFindAndModify: false });
    return course;
});
exports.createCourseAndAddToTeacher = createCourseAndAddToTeacher;
