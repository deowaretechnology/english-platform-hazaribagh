import mongoose, { Schema, type Model, type HydratedDocument } from "mongoose";

/* =========================
   User Types
========================= */

export interface IUser {
  name: string;
  phone: string;
  classLevel: string;
  enrolledCourses: {
    courseSlug: string;
    courseTitle: string;
    enrolledAt: Date;
  }[];
  createdAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

/* =========================
   User Schema
========================= */

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    classLevel: {
      type: String,
      default: "10",
    },
    enrolledCourses: [
      {
        courseSlug: {
          type: String,
          required: true,
        },
        courseTitle: {
          type: String,
          required: true,
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

/* =========================
   Test Attempt Types
========================= */

export interface ITestAttemptQuestion {
  questionText: string;
  options: string[];
  correctOption: number;
  studentAnswer: number;
  isCorrect: boolean;
}

export interface ITestAttempt {
  userId: string;
  userPhone?: string;
  testSlug: string;
  testTitle: string;
  classLevel: string;
  score: number;
  // Total marks the test was out of, and marks awarded per correct
  // question (totalMarks / totalQuestions). Both are computed dynamically
  // per test — never hardcoded — and stored so historical attempts keep
  // their original test's mark scheme even if the test is edited later.
  totalMarks: number;
  marksPerQuestion: number;
  totalQuestions: number;
  accuracyPercent: number;
  questions: ITestAttemptQuestion[];
  submittedAt: Date;
}

export type TestAttemptDocument = HydratedDocument<ITestAttempt>;

/* =========================
   Test Attempt Schema
========================= */

const TestAttemptSchema = new Schema<ITestAttempt>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userPhone: String,
    testSlug: {
      type: String,
      required: true,
      index: true,
    },
    testTitle: {
      type: String,
      required: true,
    },
    classLevel: {
      type: String,
      default: "10",
    },
    score: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    marksPerQuestion: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    accuracyPercent: {
      type: Number,
      required: true,
    },
    questions: [
      {
        questionText: {
          type: String,
          required: true,
        },
        options: [
          {
            type: String,
          },
        ],
        correctOption: {
          type: Number,
          required: true,
        },
        studentAnswer: {
          type: Number,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

/* =========================
   Models
========================= */

export const User =
  (mongoose.models.User as mongoose.Model<IUser>) ??
  mongoose.model<IUser>("User", UserSchema);

export const TestAttempt =
  (mongoose.models.TestAttempt as mongoose.Model<ITestAttempt>) ??
  mongoose.model<ITestAttempt>("TestAttempt", TestAttemptSchema);