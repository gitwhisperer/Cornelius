import React, { useState } from 'react';
import { Play, MessageCircle, Flame, AlertCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import { formatDate, formatTime } from '../../utils/helpers';
import type { Lecture, Subject } from '../../types';
import { QuizGenerator } from './QuizGenerator';
import { FlashcardsCreator } from './FlashcardsCreator';

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
    return subject?.color || '#2196F3';
  };

  const getSubjectName = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Unknown';
  };

  if (selectedLecture) {
    return <LectureDetail lecture={selectedLecture} subjects={subjects} onBack={() => setSelectedLecture(null)} />;
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Subject Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedSubject === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedSubject === subject.id
                  ? 'text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              style={selectedSubject === subject.id ? { backgroundColor: subject.color } : {}}
            >
              {subject.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Sort */}
      <div className="flex gap-3">
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="subject">By Subject</option>
          <option value="important">Important First</option>
        </select>
      </div>

      {/* Lectures List */}
      {Object.keys(groupedLectures).length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No lectures found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedLectures).map(([date, dateLectures]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="sticky top-0 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg mb-3 z-10">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{date}</h3>
              </div>

              {/* Lecture Cards */}
              <div className="space-y-4">
                {dateLectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedLecture(lecture)}
                    style={{ borderLeft: `4px solid ${getSubjectColor(lecture.subjectId)}` }}
                  >
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="text-xs font-semibold px-2 py-1 rounded"
                              style={{ backgroundColor: getSubjectColor(lecture.subjectId) + '20', color: getSubjectColor(lecture.subjectId) }}
                            >
                              {getSubjectName(lecture.subjectId)}
                            </span>
                            {lecture.isNew && <StatusBadge status="new" />}
                            {lecture.isImportant && <StatusBadge status="important" />}
                            {lecture.isExamRelevant && (
                              <div className="flex items-center gap-1">
                                <Flame className="w-4 h-4 text-red-500" />
                                <span className="text-xs text-red-500 font-medium">Exam Topic</span>
                              </div>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {lecture.title}
                          </h3>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span>{formatTime(lecture.startTime)} - {formatTime(lecture.endTime)}</span>
                        <span>{lecture.room}</span>
                        <span>{lecture.professor}</span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          {lecture.recordingDevices} devices
                        </span>
                      </div>

                      {/* Summary */}
                      {lecture.summary && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                            {lecture.summary.quick}
                          </p>
                        </div>
                      )}

                      {/* Important Info */}
                      {lecture.importantInfo && (
                        <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-semibold text-orange-900 dark:text-orange-300">Important Updates</span>
                          </div>
                          {lecture.importantInfo.assignments && lecture.importantInfo.assignments.length > 0 && (
                            <div className="text-sm text-orange-800 dark:text-orange-400">
                              Assignment: {lecture.importantInfo.assignments[0].title}
                            </div>
                          )}
                          {lecture.importantInfo.exams && lecture.importantInfo.exams.length > 0 && (
                            <div className="text-sm text-orange-800 dark:text-orange-400">
                              Exam: {lecture.importantInfo.exams[0].type} on {lecture.importantInfo.exams[0].date}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLecture(lecture);
                          }}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          View Notes
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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
    return subject?.color || '#2196F3';
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
    <div className="pb-4">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
      >
        ← Back to Lectures
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-sm font-semibold px-3 py-1 rounded"
              style={{ backgroundColor: getSubjectColor(lecture.subjectId) + '20', color: getSubjectColor(lecture.subjectId) }}
            >
              {getSubjectName(lecture.subjectId)}
            </span>
            {lecture.isExamRelevant && (
              <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded">
                <Flame className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">Exam Relevant</span>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{lecture.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{formatDate(lecture.date)}</span>
            <span>{formatTime(lecture.startTime)} - {formatTime(lecture.endTime)}</span>
            <span>{lecture.room}</span>
            <span>{lecture.professor}</span>
          </div>
        </div>

        {/* Quick Summary */}
        {lecture.summary && (
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Summary (2-min read)</h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {lecture.summary.quick}
            </p>
          </div>
        )}

        {/* Important Information */}
        {lecture.importantInfo && (
          <div className="bg-orange-50 dark:bg-orange-950/30 border-l-4 border-l-orange-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h2 className="font-semibold text-orange-900 dark:text-orange-300">Important Information</h2>
            </div>
            
            {lecture.importantInfo.assignments && lecture.importantInfo.assignments.length > 0 && (
              <div className="mb-3">
                <h3 className="font-medium text-orange-900 dark:text-orange-300 mb-2">📝 Assignments Mentioned</h3>
                {lecture.importantInfo.assignments.map((assignment, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded p-3 mb-2">
                    <div className="font-medium text-gray-900 dark:text-white">{assignment.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Due: {assignment.dueDate}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Timestamp: {assignment.timestamp}</div>
                  </div>
                ))}
              </div>
            )}
            
            {lecture.importantInfo.exams && lecture.importantInfo.exams.length > 0 && (
              <div>
                <h3 className="font-medium text-orange-900 dark:text-orange-300 mb-2">📚 Exam Topics</h3>
                {lecture.importantInfo.exams.map((exam, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded p-3">
                    <div className="font-medium text-gray-900 dark:text-white">{exam.type} Exam</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Topics: {exam.topics.join(', ')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Detailed Notes by Section */}
        {lecture.sections && lecture.sections.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Detailed Notes</h2>
            <div className="space-y-4">
              {lecture.sections.map((section, index) => (
                <div key={index} className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-700/50 transition-all"
                  >
                    <div className="flex flex-col items-start gap-2">
                      <span className="font-semibold text-base text-gray-900 dark:text-white">{section.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded font-mono">{section.timestamp}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">• {section.duration} min</span>
                      </div>
                    </div>
                    {expandedSections.has(index) ? (
                      <ChevronUp className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                  
                  {expandedSections.has(index) && (
                    <div className="p-5 space-y-4 bg-white dark:bg-gray-800">
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-800 dark:text-gray-200 text-base leading-loose">
                          {section.content}
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-base flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                          </svg>
                          Key Points:
                        </h4>
                        <ul className="space-y-2.5 text-base">
                          {section.keyPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="flex-1">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button className="text-base text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                        <Play className="w-5 h-5" />
                        Play from {section.timestamp}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Snippets */}
        {lecture.codeSnippets && lecture.codeSnippets.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Code Snippets</h2>
            {lecture.codeSnippets.map((snippet, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{snippet.description}</span>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    Copy
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))}
          </div>
        )}

        {/* Q&A Section */}
        {lecture.qna && lecture.qna.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Questions & Answers</h2>
            <div className="space-y-4">
              {lecture.qna.map((qa, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Q:</span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">{qa.question}</span>
                    {qa.student && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">- {qa.student}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">A:</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-2">{qa.answer}</span>
                  </div>
                  <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mt-2">
                    Jump to {qa.timestamp}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => setCurrentView('quiz')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Generate Quiz
          </button>
          <button 
            onClick={() => setCurrentView('flashcards')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Create Flashcards
          </button>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
            Share Notes
          </button>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
            Mark as Reviewed
          </button>
        </div>
      </div>
    </div>
  );
};