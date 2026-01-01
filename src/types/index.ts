// Core Types for Smart Lecture Notes Application

export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  batchId: string;
  role: 'student' | 'teacher' | 'admin';
  preferences: UserPreferences;
  statistics: UserStatistics;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark';
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  autoRecording: boolean;
  locationTracking: boolean;
  playbackSpeed: number;
}

export interface UserStatistics {
  lecturesAttended: number;
  assignmentsCompleted: number;
  examPerformance: number;
}

export interface Batch {
  id: string;
  name: string;
  academicYear: string;
  semester: number;
  students: string[];
  teachers: string[];
  subjects: Subject[];
  timetable: TimetableEntry[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  teacher: string;
}

export interface TimetableEntry {
  id: string;
  subjectId: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  professor: string;
}

export interface Lecture {
  id: string;
  batchId: string;
  subjectId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  room: string;
  professor: string;
  recordingDevices: number;
  status: 'upcoming' | 'live' | 'completed';
  transcript?: string;
  summary?: {
    quick: string;
    detailed: string[];
    comprehensive: string;
  };
  importantInfo?: ImportantInfo;
  codeSnippets?: CodeSnippet[];
  formulas?: string[];
  qna?: QnA[];
  sections?: LectureSection[];
  isNew?: boolean;
  isImportant?: boolean;
  isExamRelevant?: boolean;
}

export interface ImportantInfo {
  assignments?: AssignmentMention[];
  exams?: ExamMention[];
  deadlines?: Deadline[];
  officeHours?: string;
  resources?: Resource[];
}

export interface AssignmentMention {
  title: string;
  dueDate: string;
  requirements: string[];
  timestamp: string;
}

export interface ExamMention {
  type: string;
  date: string;
  topics: string[];
  timestamp: string;
}

export interface Deadline {
  title: string;
  date: string;
  type: string;
  timestamp: string;
}

export interface Resource {
  title: string;
  url: string;
  type: 'link' | 'document' | 'video';
}

export interface CodeSnippet {
  language: string;
  code: string;
  timestamp: string;
  description: string;
}

export interface QnA {
  question: string;
  answer: string;
  timestamp: string;
  student?: string;
}

export interface LectureSection {
  title: string;
  timestamp: string;
  duration: number;
  content: string;
  keyPoints: string[];
}

export interface Assignment {
  id: string;
  batchId: string;
  subjectId: string;
  title: string;
  description: string;
  requirements: string[];
  announcedInLecture?: {
    lectureId: string;
    timestamp: string;
  };
  dueDate: string;
  latePolicy?: string;
  submissionFormat: string[];
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  submittedAt?: string;
  grade?: number;
  batchStats?: {
    submitted: number;
    total: number;
    avgTime: string;
  };
  type: 'assignment' | 'lab';
  labComponents?: {
    codeSubmission: boolean;
    physicalRecord: boolean;
  };
}

export interface Exam {
  id: string;
  batchId: string;
  subjectId: string;
  title: string;
  type: 'midterm' | 'final' | 'quiz';
  date: string;
  time: string;
  duration: number;
  location: string;
  professor: string;
  syllabus: SyllabusItem[];
  format: ExamFormat;
  importantTopics: ImportantTopic[];
  studyResources: Resource[];
  isPast: boolean;
}

export interface SyllabusItem {
  chapter: string;
  topics: string[];
  reviewed: boolean;
}

export interface ExamFormat {
  mcqs?: number;
  codingProblems?: number;
  theoryQuestions?: number;
  marksDistribution: string;
  rules: string[];
}

export interface ImportantTopic {
  topic: string;
  importance: 'high' | 'medium' | 'standard';
  professorQuote: string;
  lectureReference: {
    lectureId: string;
    date: string;
    timestamp: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Source[];
  codeBlocks?: CodeBlock[];
}

export interface Source {
  lectureId: string;
  lectureTitle: string;
  timestamp: string;
  excerpt: string;
}

export interface CodeBlock {
  language: string;
  code: string;
}

export type Screen = 'home' | 'lectures' | 'tasks' | 'chat' | 'profile' | 'notifications';