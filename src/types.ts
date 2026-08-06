export type ClassLevel =
  | '9'
  | '10'
  | '11'
  | '12'
  | 'spoken-english'
  | 'competitive'
  | 'all';

export interface Course {
  id: string;
  title: string;
  subtitle: string;

  class: Exclude<ClassLevel, 'all'>;

  price: number;
  originalPrice: number;

  duration: string;
  batchTiming: string;

  mode: 'Offline' | 'Online' | 'Hybrid';

  seatsLeft: number;

  isPopular?: boolean;

  badge?: string;

  language?: string;

  ctaText?: string;

  thumbnail?: any;

  features: string[];

  instructor: string;

  teacher?: {
    _id?: string;
    name?: string;
    designation?: string;
    experience?: string;
    photo?: any;
  };
}
export interface Video {
  id: string;
  title: string;
  class: Exclude<ClassLevel, 'all' | 'spoken-english' | 'competitive'>;
  chapter: string;
  youtubeId: string;
  duration: string;
  views: string;
  uploadDate: string;
  notesSummary: string;
}

export interface Note {
  id: string;
  title: string;
  class: Exclude<ClassLevel, 'all' | 'spoken-english' | 'competitive'>;
  subject: string;
  chapter: string;
  pages: number;
  fileSize: string;
  pdfUrl: string;
  previewHighlights: string[];
}

export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Test {
  id: string;
  title: string;
  class: Exclude<ClassLevel, 'all' | 'spoken-english' | 'competitive'>;
  type: 'Weekly OMR' | 'Monthly Grand' | 'Board Mock';
  totalQuestions: number;
  marks: number;
  durationMinutes: number;
  date: string;
  status: 'Upcoming' | 'Active' | 'Completed';
  questions?: MCQQuestion[];
}

export interface Topper {
  id: string;
  name: string;
  achievement: string;
  classTag: string;
  year: string;
  photoUrl: string;
  quote: string;
  school: string;
}

export interface Testimonial {
  id: string;
  name: string;
  roleOrClass: string;
  photoUrl: string;
  comment: string;
  rating: number;
  year: string;
}

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  category: 'Admission' | 'Classes' | 'Fees' | 'Tests' | 'General' | string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  targetClass: string;
  admissionId: string;
  enrolledCourses: string[];
  testScores: {
    testTitle: string;
    score: number;
    total: number;
    date: string;
    percentile: number;
  }[];
  createdAt: string;
}
