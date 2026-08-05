import type { Course } from "../types.js";

export const coursesData: Course[] = [
  {
    id: 'course-class-10-board',
    title: 'Class 10 JAC & CBSE English Mastery',
    subtitle: 'Comprehensive literature, grammar, and answer writing practice for Board 2026',
    class: '10',
    price: 3499,
    originalPrice: 4999,
    duration: '10 Months',
    batchTiming: 'Morning: 07:00 AM - 08:30 AM | Evening: 04:00 PM - 05:30 PM',
    mode: 'Hybrid',
    seatsLeft: 8,
    isPopular: true,
    features: [
      'First Flight & Footprints without Feet Complete Coverage',
      'Grammar: Tenses, Modals, Passive Voice, Direct/Indirect',
      'Weekly OMR & Subjective Board Pattern Tests',
      'Chapterwise Printed Handwritten Notes & Workbook',
      'Special Answer Presentation & Handwriting Improvement Desk'
    ],
    instructor: 'Er. R. K. Verma & Team'
  },
  {
    id: 'course-class-12-board',
    title: 'Class 12 JAC & CBSE Core English Target Batch',
    subtitle: 'Flamingo & Vistas with Advanced Writing Skills & unseen passage strategies',
    class: '12',
    price: 3999,
    originalPrice: 5999,
    duration: '10 Months',
    batchTiming: 'Morning: 08:30 AM - 10:00 AM | Evening: 05:30 PM - 07:00 PM',
    mode: 'Hybrid',
    seatsLeft: 5,
    isPopular: true,
    features: [
      'Complete Flamingo & Vistas Line-by-Line Hindi Explanation',
      'Formal Letters, Articles, Notices, Report Writing Formulas',
      'Previous 15 Years JAC & CBSE Solved Papers',
      '1-on-1 Personal Speaking & Viva Preparation',
      'Dedicated Doubt Clearing Session Every Saturday'
    ],
    instructor: 'Prof. S. N. Pandey & Senior Faculty'
  },
  {
    id: 'course-class-11-foundation',
    title: 'Class 11 Academic & Competitive Foundation',
    subtitle: 'Hornbill & Snapshots with Advanced Grammar & Vocabulary Building',
    class: '11',
    price: 3499,
    originalPrice: 4499,
    duration: '10 Months',
    batchTiming: 'Morning: 10:00 AM - 11:30 AM | Evening: 03:00 PM - 04:30 PM',
    mode: 'Offline',
    seatsLeft: 12,
    isPopular: false,
    features: [
      'Hornbill & Snapshots Chapterwise Deep Analysis',
      'Syntax, Transformation of Sentences, Clauses & Prepositions',
      'Competitive Foundation for NDA, CUET & SSC',
      'Weekly Vocabulary Boosters (Synonyms, Antonyms, Idioms)',
      'Free Printed Chapter Question Banks'
    ],
    instructor: 'Er. R. K. Verma'
  },
  {
    id: 'course-class-9-foundation',
    title: 'Class 9 Strong Base English Foundation',
    subtitle: 'Beehive & Moments with fundamental English grammar and reading comprehension',
    class: '9',
    price: 2999,
    originalPrice: 3999,
    duration: '10 Months',
    batchTiming: 'Evening: 02:00 PM - 03:30 PM',
    mode: 'Offline',
    seatsLeft: 14,
    isPopular: false,
    features: [
      'Beehive & Moments Complete Chapter Exercises',
      'Basic to Advanced Sentence Structure & Parts of Speech',
      'Paragraph, Story & Diary Entry Writing Techniques',
      'Regular Dictation & Pronunciation Exercises',
      'Monthly Parent-Teacher Performance Meetings'
    ],
    instructor: 'Ms. Ananya Sharma'
  },
  {
    id: 'course-spoken-english',
    title: 'Fluent Spoken English & Personality Development',
    subtitle: 'Overcome hesitation, speak fluent English with confidence & public speaking skills',
    class: 'spoken-english',
    price: 2499,
    originalPrice: 3499,
    duration: '3 Months (Express)',
    batchTiming: 'Batch A: 11:30 AM - 01:00 PM | Batch B: 06:30 PM - 08:00 PM',
    mode: 'Hybrid',
    seatsLeft: 6,
    isPopular: true,
    features: [
      'Daily GD (Group Discussion) & Extempore Rounds',
      'Phonics, Accent Neutralization & Pronunciation Drills',
      'Interview Preparation & Body Language Grooming',
      'Audio-Visual Language Lab Sessions',
      'Course Completion Certificate & Audio Assessment'
    ],
    instructor: 'Mr. Vivek Anand (Corporate Trainer)'
  },
  {
    id: 'course-competitive-english',
    title: 'SSC CGL, CHSL, Railway & NDA English Masterclass',
    subtitle: 'Spotting Errors, Cloze Test, Reading Comprehension & Synonyms/Antonyms shortcuts',
    class: 'competitive',
    price: 4499,
    originalPrice: 6999,
    duration: '6 Months',
    batchTiming: 'Early Morning: 06:00 AM - 07:30 AM',
    mode: 'Hybrid',
    seatsLeft: 10,
    isPopular: false,
    features: [
      '3000+ High-Frequency Exam Vocabulary Words with Mnemonics',
      '120 Rules of Grammar with Shortcut Elimination Tricks',
      'Daily 50-Question Speed Mock Test with Analytics',
      'Previous 10 Years SSC & Defence Question Breakdown',
      'Special Doubt Cell & Lifetime Revision Support'
    ],
    instructor: 'Er. R. K. Verma'
  }
];
