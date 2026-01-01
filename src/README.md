# Smart Lecture Notes

A comprehensive AI-powered collaborative learning platform for educational institutions that automatically captures, transcribes, and organizes lecture content for student batches while providing intelligent study assistance.

## Features

### 🏠 Home Dashboard
- **Live Lecture Status**: Real-time view of ongoing lectures with device recording counts
- **Today's Schedule**: Complete overview of daily classes and timings
- **Urgent Alerts**: High-priority notifications for imminent deadlines
- **Quick Statistics**: Pending assignments, days to exams, and new lecture notes
- **AI Study Suggestions**: Personalized recommendations based on your learning patterns
- **Recent Activity Feed**: Timeline of notes, submissions, and batch discussions

### 📚 Lectures Library
- **Subject Filtering**: Easy navigation through different courses
- **Smart Sorting**: Filter by date, importance, or subject
- **Detailed Notes**: AI-generated summaries, key points, and timestamps
- **Code Snippets**: Syntax-highlighted code examples from lectures
- **Q&A Section**: Student questions and professor answers with timestamps
- **Important Alerts**: Assignments, exams, and deadlines mentioned in lectures
- **Exam-Relevant Tagging**: Identifies topics emphasized for exams

### 📝 Assignments & Labs
- **Status Tracking**: Overdue, due soon, upcoming, and submitted categories
- **Batch Insights**: See submission statistics and average completion time
- **Requirements Checklist**: Clear list of all assignment requirements
- **Lecture References**: Direct links to where assignments were announced
- **Lab Components**: Track code submissions and physical records separately
- **Late Policy Warnings**: Clear visibility of late submission rules

### 📅 Exams Schedule
- **Countdown Timers**: Days/hours remaining for each exam
- **Syllabus Tracker**: Interactive checklist to mark reviewed topics
- **Progress Visualization**: See your preparation percentage
- **Important Topics**: Professor-emphasized subjects with lecture references
- **Exam Format Details**: MCQs, coding problems, theory questions breakdown
- **Study Resources**: Textbooks, papers, and reference materials
- **Study Plan Generator**: AI-powered preparation schedule

### 💬 AI Chat Assistant
- **Semantic Search**: Ask questions across all batch lectures
- **Source Citations**: Every answer links to exact lecture timestamps
- **Multilingual Support**: Get responses in 100+ languages
- **Practice Problems**: Generate quizzes and exercises from lecture content
- **Code Help**: Assistance with assignments and concepts
- **Quick Actions**: Pre-built prompts for common questions

### 👤 Profile & Settings
- **Academic Statistics**: Lectures attended, assignments completed, exam performance
- **Theme Toggle**: Full dark mode support
- **Language Preferences**: Multilingual interface
- **Notification Controls**: Manage push, email, and SMS notifications
- **Privacy Settings**: Location tracking and recording preferences
- **Help & Support**: Easy access to tutorials and assistance

## Design System

### Color Palette
- **Primary**: Blue (#2196F3) for main actions and highlights
- **Success**: Green (#4CAF50) for completed items
- **Warning**: Orange (#FF9800) for due soon items
- **Error**: Red (#F44336) for overdue and critical items
- **Subject Colors**: Unique colors for each course (DSA, ML, DBMS, OS, Networks)

### Typography
- **Headings**: Bold, clear hierarchy from H1 (24px) to H4 (16px)
- **Body Text**: 14-16px with proper line height for readability
- **Labels & Badges**: Uppercase, semi-bold for status indicators

### Components
- **Cards**: Rounded corners (12px), subtle shadows, hover effects
- **Buttons**: Primary (filled), Secondary (outlined), Tertiary (text)
- **Badges**: Pill-shaped status indicators with semantic colors
- **Progress Bars**: Smooth animations with color-coded states

### Dark Mode
- Complete theme implementation with proper contrast
- Smooth transitions between modes
- Optimized for readability in all lighting conditions

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Backend Ready**: Supabase integration prepared

## Mock Data Structure

The application includes comprehensive mock data demonstrating:
- 5 lectures across different subjects with detailed notes
- 5 assignments in various states (overdue, pending, submitted)
- 3 exams with syllabus tracking and important topics
- Chat history with AI responses and sources
- User profiles with preferences and statistics

## Key Features Demonstrated

1. **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
2. **Accessibility**: WCAG compliant with proper ARIA labels
3. **Performance**: Optimized rendering and smooth animations
4. **User Experience**: Intuitive navigation and clear information hierarchy
5. **Dark Mode**: Complete theme system with localStorage persistence

## Future Enhancements (Backend Integration)

When connected to a full backend system:
- Multi-device collaborative recording with GPS verification
- Real-time audio transcription using speech-to-text APIs
- AI-powered content extraction (assignments, deadlines, key topics)
- Semantic search across all lectures using vector databases
- Real-time notifications and calendar syncing
- Batch-wide collaboration features
- Progress tracking and analytics

## Getting Started

The application is pre-configured with mock data to demonstrate all features. Simply navigate through the bottom navigation to explore:

1. **Home**: See your dashboard with live updates
2. **Lectures**: Browse and view detailed lecture notes
3. **Tasks**: Manage assignments and lab submissions
4. **Exams**: Track exam preparation and important topics
5. **AI Chat**: Interact with the study assistant
6. **Profile**: Customize your settings

## Notes

- All timestamps and dates are dynamically calculated
- Dark mode preference is saved to localStorage
- The UI is fully responsive across all screen sizes
- Component architecture is modular and maintainable
- TypeScript provides full type safety

---

Built with ❤️ for students and educators
