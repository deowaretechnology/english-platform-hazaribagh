export interface Video {
  id: string;
  title: string;
  class: string;
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
  class: string;
  subject: string;
  chapter: string;
  pages: number;
  fileSize: string;
  pdfUrl: string;
  previewHighlights: string[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  class: string;
  price: number;
  originalPrice: number;
  duration: string;
  batchTiming: string;
  mode: string;
  seatsLeft: number;
  isPopular: boolean;
  features: string[];
  instructor: string;
}

export interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Test {
  id: string;
  title: string;
  class: string;
  type: string;
  totalQuestions: number;
  marks: number;
  durationMinutes: number;
  date: string;
  status: string;
  questions?: TestQuestion[];
}