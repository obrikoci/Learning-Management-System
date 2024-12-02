import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

// Define the IComment interface
interface IComment extends Document {
  user: mongoose.Types.ObjectId; 
  content: string; 
  replies?: IComment[]; 
}

// Define the ILecture interface
interface ILecture {
  title?: string;
  description?: string;
  filePath?: string; 
  originalName?: string;
  _id?: mongoose.Types.ObjectId; 

}

// Define the ICourse interface
export interface ICourse extends Document {
  title: string; 
  description: string; 
  instructor: mongoose.Types.ObjectId; 
  enrolledStudents: mongoose.Types.ObjectId[];
  lectures: ILecture[]; 
  comments: IComment[]; 
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
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    filePath: { 
      type: String, 
      required: true, 
    },
      originalName: { 
        type: String, 
        required: false, 
      },
  },
  { timestamps: true }
);

// Define the Course Schema
const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true, 
    },
    description: {
      type: String,
      required: true, 
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
      },
    ],
    lectures: [lectureSchema], 
    comments: [commentSchema], 
  },
  { timestamps: true }
);

// Create and export the Course model
const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;
