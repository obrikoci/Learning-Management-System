import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

// Define the IComment interface
interface IComment extends Document {
  user: mongoose.Types.ObjectId; // Reference to User model
  content: string; // Comment content
  replies?: IComment[]; // Nested replies to the comment
}

// Define the ILecture interface
interface ILecture extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoLength?: number; // Optional length in minutes
}

// Define the ICourse interface
export interface ICourse extends Document {
  title: string; // Course title
  description: string; // Course description
  instructor: mongoose.Types.ObjectId; // Reference to the instructor (User)
  enrolledStudents: mongoose.Types.ObjectId[]; // Array of enrolled students
  lectures: ILecture[]; // Lectures associated with the course
  comments: IComment[]; // Comments for the course
}

// Define the Comment Schema
const commentSchema = new Schema<IComment>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
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
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// Define the Lecture Schema
const lectureSchema = new Schema<ILecture>(
  {
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
  },
  { timestamps: true }
);

// Define the Course Schema
const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true, // Title is mandatory
    },
    description: {
      type: String,
      required: true, // Description is mandatory
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the teacher who created it
      required: true,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to students who enrolled
      },
    ],
    lectures: [lectureSchema], // Array of lectures
    comments: [commentSchema], // Array of comments
  },
  { timestamps: true }
);

// Create and export the Course model
const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;
