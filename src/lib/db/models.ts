import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnrolledCourse {
  courseSlug: string;
  courseTitle: string;
  enrolledAt: Date;
}

export interface IUser extends Document {
  name: string;
  phone: string;
  classLevel: string;
  enrolledCourses: IEnrolledCourse[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    classLevel: { type: String, required: true, default: '10' },
    enrolledCourses: [
      {
        courseSlug: { type: String, required: true },
        courseTitle: { type: String, required: true },
        enrolledAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export interface IQuestionSnapshot {
  questionText: string;
  options: string[];
  correctOption: number;
  studentAnswer: number;
  isCorrect: boolean;
}

export interface ITestAttempt extends Document {
  userId: string;
  userPhone?: string;
  testSlug: string;
  testTitle: string;
  classLevel: string;
  score: number;
  totalQuestions: number;
  accuracyPercent: number;
  questions: IQuestionSnapshot[];
  submittedAt: Date;
}

const TestAttemptSchema = new Schema<ITestAttempt>(
  {
    userId: { type: String, required: true, index: true },
    userPhone: { type: String, index: true },
    testSlug: { type: String, required: true },
    testTitle: { type: String, required: true },
    classLevel: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    accuracyPercent: { type: Number, required: true },
    questions: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String }],
        correctOption: { type: Number, required: true },
        studentAnswer: { type: Number },
        isCorrect: { type: Boolean, required: true }
      }
    ],
    submittedAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

export const User = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
export const TestAttempt = (mongoose.models.TestAttempt as Model<ITestAttempt>) || mongoose.model<ITestAttempt>('TestAttempt', TestAttemptSchema);
