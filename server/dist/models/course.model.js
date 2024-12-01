"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the Comment Schema
const commentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    replies: [
        {
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            },
            content: {
                type: String,
            },
        },
    ],
}, { timestamps: true });
// Define the Lecture Schema
const lectureSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    videoLength: {
        type: Number, // Optional length in minutes
    },
}, { timestamps: true });
// Define the Course Schema
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true, // Title is mandatory
    },
    description: {
        type: String,
        required: true, // Description is mandatory
    },
    instructor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", // Reference to the teacher who created it
        required: true,
    },
    enrolledStudents: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User", // Reference to students who enrolled
        },
    ],
    lectures: [lectureSchema], // Array of lectures
    comments: [commentSchema], // Array of comments
}, { timestamps: true });
// Create and export the Course model
const CourseModel = mongoose_1.default.model("Course", courseSchema);
exports.default = CourseModel;
