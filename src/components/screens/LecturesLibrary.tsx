import React, { useState } from 'react';
import { Play, MessageCircle, Flame, AlertCircle, FileText, ChevronDown, ChevronUp, Clock, MapPin, Users } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import { formatDate, formatTime } from '../../utils/helpers';
import type { Lecture, Subject } from '../../types';
import { QuizGenerator } from './QuizGenerator';
import { FlashcardsCreator } from './FlashcardsCreator';
import { motion, AnimatePresence } from 'motion/react';

interface LecturesLibraryProps {
  lectures: Lecture[];
  subjects: Subject[];
}

export const LecturesLibrary: React.FC<LecturesLibraryProps> = ({ lectures, subjects }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('latest');
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  // Filter lectures
  const filteredLectures = lectures.filter((lecture) => {
    if (selectedSubject !== 'all' && lecture.subjectId !== selectedSubject) return false;

    const lectureDate = new Date(lecture.date);
    const today = new Date();

    if (selectedFilter === 'today') {
      return lectureDate.toDateString() === today.toDateString();
    } else if (selectedFilter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return lectureDate >= weekAgo;
    } else if (selectedFilter === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      return lectureDate >= monthAgo;
    }

    return true;
  });

  // Sort lectures
  const sortedLectures = [...filteredLectures].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === 'subject') {
      return a.subjectId.localeCompare(b.subjectId);
    } else if (sortBy === 'important') {
      return (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0);
    }
    return 0;
  });

  // Group by date
  const groupedLectures: { [key: string]: Lecture[] } = {};
  sortedLectures.forEach((lecture) => {
    const dateKey = formatDate(lecture.date);
    if (!groupedLectures[dateKey]) {
      groupedLectures[dateKey] = [];
    }
    groupedLectures[dateKey].push(lecture);
  });

  const getSubjectColor = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.color || '#3b82f6';
  };

  const getSubjectName = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Unknown';
  };

  if (selectedLecture) {
    return <LectureDetail lecture={selectedLecture} subjects={subjects} onBack={() => setSelectedLecture(null)} />;
  }

  return (
    <motion.div
      className="space-y-4 px-4 pb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Subject Filter Chips */}
      <div className="pt-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
          <motion.button
            onClick={() => setSelectedSubject('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedSubject === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            whileTap={{ scale: 0.95 }}
          >
            All
          </motion.button>
          {subjects.map((subject) => (
            <motion.button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedSubject === subject.id
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              style={selectedSubject === subject.id ? {
                background: `linear-gradient(135deg, ${subject.color}, ${subject.color}dd)`,
                boxShadow: `0 8px 20px -4px ${subject.color}40`
              } : {}}
              whileTap={{ scale: 0.95 }}
            >
              {subject.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filter and Sort Row */}
      <div className="flex gap-2">
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="flex-1 px-3 py-2.5 bg-white dark:bg-[#171717] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="flex-1 px-3 py-2.5 bg-white dark:bg-[#171717] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="subject">Subject</option>
          <option value="important">Important</option>
        </select>
      </div>

      {/* Lectures List */}
      {Object.keys(groupedLectures).length === 0 ? (
        <motion.div
          className="bg-white dark:bg-[#171717] rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No lectures found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters</p>
        </motion.div>
      ) : (
        <div className="space-y-5">
          {Object.entries(groupedLectures).map(([date, dateLectures], groupIndex) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent" />
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{date}</span>
                <div className="h-px flex-1 bg-gradient-to-l from-gray-200 dark:from-gray-800 to-transparent" />
              </div>

              {/* Lecture Cards */}
              <div className="space-y-3">
                {dateLectures.map((lecture, index) => (
                  <motion.div
                    key={lecture.id}
                    className="group bg-white dark:bg-[#171717] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedLecture(lecture)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                  >
                    {/* Subject Color Bar */}
                    <div
                      className="h-1 w-full"
                      style={{ background: `linear-gradient(90deg, ${getSubjectColor(lecture.subjectId)}, ${getSubjectColor(lecture.subjectId)}80)` }}
                    />

                    <div className="p-4">
                      {/* Header with badges */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="text-xs font-bold px-2.5 py-1 rounded-lg"
                            style={{
                              backgroundColor: getSubjectColor(lecture.subjectId) + '15',
                              color: getSubjectColor(lecture.subjectId)
                            }}
                          >
                            {getSubjectName(lecture.subjectId)}
                          </span>
                          {lecture.isNew && <StatusBadge status="new" />}
                          {lecture.isImportant && <StatusBadge status="important" />}
                        </div>
                        {lecture.isExamRelevant && (
                          <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-lg">
                            <Flame className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase">Exam</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {lecture.title}
                      </h3>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(lecture.startTime)} - {formatTime(lecture.endTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {lecture.room}
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          {lecture.recordingDevices} recording
                        </span>
                      </div>

                      {/* Quick Summary */}
                      {lecture.summary && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {lecture.summary.quick}
                        </p>
                      )}

                      {/* Important Info Alert */}
                      {lecture.importantInfo && (
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-xl p-3 mb-3">
                          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="text-xs font-semibold">Important updates available</span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLecture(lecture);
                          }}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-semibold shadow-lg shadow-blue-500/20"
                        >
                          View Notes
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Lecture Detail Component
interface LectureDetailProps {
  lecture: Lecture;
  subjects: Subject[];
  onBack: () => void;
}

const LectureDetail: React.FC<LectureDetailProps> = ({ lecture, subjects, onBack }) => {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [currentView, setCurrentView] = useState<'notes' | 'quiz' | 'flashcards'>('notes');

  const getSubjectColor = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.color || '#3b82f6';
  };

  const getSubjectName = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Unknown';
  };

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  if (currentView === 'quiz') {
    return <QuizGenerator onBack={() => setCurrentView('notes')} topic={lecture.title} />;
  }

  if (currentView === 'flashcards') {
    return <FlashcardsCreator onBack={() => setCurrentView('notes')} topic={lecture.title} />;
  }

  return (
    <motion.div
      className="px-4 pb-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium inline-flex items-center gap-2"
        whileTap={{ scale: 0.95 }}
      >
        <ChevronDown className="w-4 h-4 rotate-90" />
        Back to Lectures
      </motion.button>

      <div className="bg-white dark:bg-[#171717] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Header with subject color */}
        <div
          className="h-2 w-full"
          style={{ background: `linear-gradient(90deg, ${getSubjectColor(lecture.subjectId)}, ${getSubjectColor(lecture.subjectId)}60)` }}
        />

        <div className="p-5 space-y-5">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className="text-sm font-bold px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: getSubjectColor(lecture.subjectId) + '15', color: getSubjectColor(lecture.subjectId) }}
              >
                {getSubjectName(lecture.subjectId)}
              </span>
              {lecture.isExamRelevant && (
                <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 rounded-lg">
                  <Flame className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600 dark:text-red-400 font-bold">Exam Relevant</span>
                </div>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{lecture.title}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(lecture.date)}
              </span>
              <span>{formatTime(lecture.startTime)} - {formatTime(lecture.endTime)}</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {lecture.room}
              </span>
            </div>
          </div>

          {/* Quick Summary */}
          {lecture.summary && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
              <h2 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-lg">📝</span>
                Quick Summary
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {lecture.summary.quick}
              </p>
            </div>
          )}

          {/* Important Information */}
          {lecture.importantInfo && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-4 border-l-4 border-l-amber-500 border border-amber-100 dark:border-amber-900/30">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h2 className="font-bold text-amber-900 dark:text-amber-300">Important Information</h2>
              </div>

              {lecture.importantInfo.assignments && lecture.importantInfo.assignments.length > 0 && (
                <div className="mb-3">
                  <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-2 text-sm">📝 Assignments Mentioned</h3>
                  {lecture.importantInfo.assignments.map((assignment, i) => (
                    <div key={i} className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 mb-2">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{assignment.title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Due: {assignment.dueDate}</div>
                    </div>
                  ))}
                </div>
              )}

              {lecture.importantInfo.exams && lecture.importantInfo.exams.length > 0 && (
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-2 text-sm">📚 Exam Topics</h3>
                  {lecture.importantInfo.exams.map((exam, i) => (
                    <div key={i} className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{exam.type} Exam</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Topics: {exam.topics.join(', ')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Detailed Notes by Section */}
          {lecture.sections && lecture.sections.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Detailed Notes</h2>
              <div className="space-y-3">
                {lecture.sections.map((section, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                    <motion.button
                      onClick={() => toggleSection(index)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-left"
                    >
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{section.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-2 py-0.5 rounded font-mono">{section.timestamp}</span>
                          <span className="text-xs text-gray-400">• {section.duration} min</span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedSections.has(index) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {expandedSections.has(index) && (
                        <motion.div
                          className="p-4 space-y-4 bg-white dark:bg-[#171717]"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {section.content}
                          </p>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border-l-4 border-blue-500">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm flex items-center gap-2">
                              <span className="text-blue-500">✦</span>
                              Key Points
                            </h4>
                            <ul className="space-y-2">
                              {section.keyPoints.map((point, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                            <Play className="w-4 h-4" />
                            Play from {section.timestamp}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Snippets */}
          {lecture.codeSnippets && lecture.codeSnippets.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Code Snippets</h2>
              {lecture.codeSnippets.map((snippet, index) => (
                <div key={index} className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{snippet.description}</span>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium">
                      Copy
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* Q&A Section */}
          {lecture.qna && lecture.qna.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Questions & Answers</h2>
              <div className="space-y-3">
                {lecture.qna.map((qa, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="mb-2">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Q:</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">{qa.question}</span>
                      {qa.student && (
                        <span className="text-xs text-gray-400 ml-2">— {qa.student}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">A:</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 ml-2">{qa.answer}</span>
                    </div>
                    <button className="text-xs text-gray-400 hover:text-blue-500 mt-2">
                      Jump to {qa.timestamp}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setCurrentView('quiz')}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-semibold shadow-lg shadow-blue-500/20"
            >
              Generate Quiz
            </button>
            <button
              onClick={() => setCurrentView('flashcards')}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all text-sm font-semibold shadow-lg shadow-purple-500/20"
            >
              Create Flashcards
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};