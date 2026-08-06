export type ClassLevel =
  | "9"
  | "10"
  | "11"
  | "12"
  | "spoken-english"
  | "competitive";

export type CourseMode = "Offline" | "Online" | "Hybrid";

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  class: ClassLevel;
  price: number;
  originalPrice: number;
  duration: string;
  batchTiming: string;
  mode: CourseMode;
  seatsLeft: number;
  isPopular: boolean;
  features: string[];
  instructor: string;
}

export interface Note {
  id: string;
  title: string;
  class: Extract<ClassLevel, "9" | "10" | "11" | "12">;
  subject: string;
  chapter: string;
  pages: number;
  fileSize: string;
  pdfUrl: string;
  previewHighlights: string[];
}

export interface Video {
  id: string;
  title: string;
  class: Extract<ClassLevel, "9" | "10" | "11" | "12">;
  chapter: string;
  youtubeId: string;
  duration: string;
  views: string;
  uploadDate: string;
  notesSummary: string;
}

export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type TestType =
  | "Weekly OMR"
  | "Monthly Grand"
  | "Board Mock";

export type TestStatus =
  | "Upcoming"
  | "Active"
  | "Completed";

export interface Test {
  id: string;
  title: string;
  class: Extract<ClassLevel, "9" | "10" | "11" | "12">;
  type: TestType;
  totalQuestions: number;
  marks: number;
  durationMinutes: number;
  date: string;
  status: TestStatus;
  questions?: MCQQuestion[];
}