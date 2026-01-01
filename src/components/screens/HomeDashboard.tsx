import React from 'react';
import { Clock, AlertCircle, CheckCircle2, TrendingUp, Play, BookOpen, FileText, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import { formatTime, getTimeUntil, formatDateShort } from '../../utils/helpers';
import type { Lecture, Assignment, Screen } from '../../types';
import { motion } from 'motion/react';

interface HomeDashboardProps {
  lectures: Lecture[];
  assignments: Assignment[];
  onNavigate: (screen: Screen) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ lectures, assignments, onNavigate }) => {
  // Get live and upcoming lectures for today
  const liveLecture = lectures.find(l => l.status === 'live');
  const todayLectures = lectures.filter(l => {
    const lectureDate = new Date(l.date);
    const today = new Date();
    return lectureDate.toDateString() === today.toDateString();
  });

  // Get urgent assignments (due within 24 hours)
  const urgentAssignments = assignments.filter(a => {
    if (a.status === 'submitted' || a.status === 'graded') return false;
    const now = new Date();
    const dueDate = new Date(a.dueDate);
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24 && diffHours >= 0;
  });

  // Get overdue assignments
  const overdueAssignments = assignments.filter(a => a.status === 'overdue');

  // Calculate statistics
  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const newLecturesCount = lectures.filter(l => l.isNew).length;

  // Today's tasks
  const todayTasks = [
    { id: 1, text: 'Review today\'s lecture notes', completed: false, type: 'Review' },
    { id: 2, text: 'Complete ML Assignment', completed: false, type: 'Assignment' },
    { id: 3, text: 'Prepare for DSA Midterm', completed: false, type: 'Study' },
  ];

  // AI Suggestions
  const aiSuggestions = [
    { id: 1, text: 'Review Graph Algorithms from Jan 9 lecture', reason: 'Mentioned for upcoming exam' },
    { id: 2, text: 'Practice Dijkstra\'s algorithm implementation', reason: 'Assignment due soon' },
  ];

  // Recent activity
  const recentActivity = [
    { id: 1, type: 'lecture', text: 'New lecture notes available: Neural Networks', time: '2 hours ago', icon: BookOpen },
    { id: 2, type: 'assignment', text: 'Assignment submitted: Network Protocol Analysis', time: '5 hours ago', icon: CheckCircle2 },
    { id: 3, type: 'announcement', text: 'Exam schedule updated for DSA Midterm', time: '1 day ago', icon: CalendarIcon },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 px-4 pb-4 pt-2"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="flex flex-col gap-1 mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Good Morning</h2>
        <p className="text-gray-500 dark:text-gray-400">Ready to conquer today's goals?</p>
      </motion.div>

      {/* Today's Schedule */}
      <motion.section variants={itemVariants} className="bg-white dark:bg-[#171717] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
           <h2 className="text-lg font-bold text-gray-900 dark:text-white">Today's Schedule</h2>
           <button onClick={() => onNavigate('tasks')} className="text-sm font-medium text-blue-600 dark:text-blue-400">View All</button>
        </div>
        
        {liveLecture ? (
          <div className="bg-white dark:bg-[#0a0a0a] border border-green-200 dark:border-green-900/30 rounded-2xl p-5 mb-4 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <StatusBadge status="live" label="LIVE" size="medium" />
                <div className="flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span>Recording</span>
                </div>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 leading-tight">
              {liveLecture.title}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {formatTime(liveLecture.startTime)} - {formatTime(liveLecture.endTime)}
              </span>
              <span>{liveLecture.room}</span>
            </div>
            <button
              onClick={() => onNavigate('lectures')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-semibold shadow-lg shadow-green-500/20"
            >
              <FileText className="w-4 h-4" />
              Open Live Notes
            </button>
          </div>
        ) : null}

        {todayLectures.filter(l => l.status !== 'live').length > 0 ? (
          <div className="space-y-3">
            {todayLectures.filter(l => l.status !== 'live').map((lecture) => (
              <div key={lecture.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-0.5">{lecture.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {formatTime(lecture.startTime)} - {formatTime(lecture.endTime)}
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    {lecture.room}
                  </div>
                </div>
                {lecture.status === 'upcoming' && (
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center border border-gray-100 dark:border-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : !liveLecture ? (
          <div className="text-center py-8">
             <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
               <CalendarIcon className="w-5 h-5 text-gray-400" />
             </div>
             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No classes today. Enjoy your break!</p>
          </div>
        ) : null}
      </motion.section>

      {/* Urgent Alerts */}
      {(urgentAssignments.length > 0 || overdueAssignments.length > 0) && (
        <motion.section variants={itemVariants} className="bg-white dark:bg-[#171717] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Attention Required</h2>
          </div>
          
          <div className="space-y-3">
            {overdueAssignments.slice(0, 2).map((assignment) => (
              <div key={assignment.id} className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <StatusBadge status="overdue" />
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
                    {getTimeUntil(assignment.dueDate)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{assignment.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Due: {formatDateShort(assignment.dueDate)}
                </p>
                <button
                  onClick={() => onNavigate('tasks')}
                  className="w-full py-2 bg-white dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-gray-50 dark:hover:bg-red-900/50 transition-colors text-sm font-medium border border-red-100 dark:border-red-800/50"
                >
                  Submit Now
                </button>
              </div>
            ))}
            
            {urgentAssignments.map((assignment) => (
              <div key={assignment.id} className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <StatusBadge status="pending" label="DUE SOON" />
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                    {getTimeUntil(assignment.dueDate)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{assignment.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Due: {formatDateShort(assignment.dueDate)}
                </p>
                <button
                  onClick={() => onNavigate('tasks')}
                   className="w-full py-2 bg-white dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-gray-50 dark:hover:bg-orange-900/50 transition-colors text-sm font-medium border border-orange-100 dark:border-orange-800/50"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Quick Statistics - Grid */}
      <motion.section variants={itemVariants} className="grid grid-cols-2 gap-4">
        <div className="bg-blue-500 text-white rounded-3xl p-5 shadow-lg shadow-blue-500/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-6 -mt-6" />
           <div className="relative z-10">
             <div className="text-4xl font-bold mb-1">{pendingCount}</div>
             <div className="text-blue-100 font-medium text-sm">Pending Tasks</div>
           </div>
        </div>
        <div className="bg-white dark:bg-[#171717] border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm">
           <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{newLecturesCount}</div>
           <div className="text-gray-500 dark:text-gray-400 font-medium text-sm">New Notes</div>
        </div>
      </motion.section>

      {/* Today's Tasks */}
      <motion.section variants={itemVariants} className="bg-white dark:bg-[#171717] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Focus Tasks</h2>
        <div className="space-y-3">
          {todayTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onNavigate('tasks')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-left group border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                  {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {task.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.section>

      {/* AI Suggestions */}
      <motion.section variants={itemVariants} className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-lg shadow-indigo-500/20 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-6 relative z-10">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold">Smart Suggestions</h2>
        </div>
        
        <div className="space-y-3 relative z-10">
          {aiSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors cursor-pointer">
              <div className="font-semibold mb-1 text-sm">{suggestion.text}</div>
              <div className="text-xs text-indigo-100 opacity-80">{suggestion.reason}</div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};