import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  classLevel: string;
  enrolledCourses: Array<{
    courseSlug: string;
    courseTitle: string;
    enrolledAt: Date;
  }>;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true, index: true },
  classLevel: { type: String, default: '10' },
  enrolledCourses: [
    {
      courseSlug: { type: String, required: true },
      courseTitle: { type: String, required: true },
      enrolledAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export interface ITestAttemptQuestion {
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
  questions: ITestAttemptQuestion[];
  submittedAt: Date;
}

const TestAttemptSchema = new Schema<ITestAttempt>({
  userId: { type: String, required: true, index: true },
  userPhone: { type: String },
  testSlug: { type: String, required: true, index: true },
  testTitle: { type: String, required: true },
  classLevel: { type: String, default: '10' },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  accuracyPercent: { type: Number, required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String }],
      correctOption: { type: Number, required: true },
      studentAnswer: { type: Number, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema, 'users');
export const TestAttempt = mongoose.models.TestAttempt || mongoose.model<ITestAttempt>('TestAttempt', TestAttemptSchema, 'testattempts');
