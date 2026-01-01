import React, { useState } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, Book, CheckCircle2, ExternalLink } from 'lucide-react';
import { ProgressBar } from '../shared/ProgressBar';
import { formatDateShort, getDaysUntilExam, calculateExamProgress } from '../../utils/helpers';
import type { Exam, Subject } from '../../types';

interface ExamsScheduleProps {
  exams: Exam[];
  subjects: Subject[];
}

export const ExamsSchedule: React.FC<ExamsScheduleProps> = ({ exams, subjects }) => {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const upcomingExams = exams.filter(e => !e.isPast);
  const pastExams = exams.filter(e => e.isPast);

  const getSubjectName = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Unknown';
  };

  const getSubjectColor = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.color || '#2196F3';
  };

  if (selectedExam) {
    return <ExamDetail exam={selectedExam} subjects={subjects} onBack={() => setSelectedExam(null)} />;
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Upcoming Exams */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upcoming Exams</h2>
        {upcomingExams.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No upcoming exams</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingExams.map((exam) => {
              const daysUntil = getDaysUntilExam(exam.date);
              const progress = calculateExamProgress(exam);
              const urgency = daysUntil <= 3 ? 'critical' : daysUntil <= 7 ? 'high' : 'medium';

              return (
                <div
                  key={exam.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow ${
                    urgency === 'critical' ? 'border-l-4 border-l-red-500' :
                    urgency === 'high' ? 'border-l-4 border-l-orange-500' :
                    'border-l-4 border-l-blue-500'
                  }`}
                  onClick={() => setSelectedExam(exam)}
                >
                  {/* Countdown */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4 ${
                    urgency === 'critical' ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400' :
                    urgency === 'high' ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400' :
                    'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                  }`}>
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold text-lg">
                      {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days left`}
                    </span>
                  </div>

                  {/* Exam Info */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-sm font-semibold px-3 py-1 rounded"
                        style={{ backgroundColor: getSubjectColor(exam.subjectId) + '20', color: getSubjectColor(exam.subjectId) }}
                      >
                        {getSubjectName(exam.subjectId)}
                      </span>
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded font-medium uppercase">
                        {exam.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{exam.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDateShort(exam.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {exam.time} ({exam.duration} min)
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {exam.location}
                      </span>
                    </div>
                  </div>

                  {/* Syllabus Progress */}
                  <div className="mb-4">
                    <ProgressBar
                      value={progress}
                      color={progress >= 70 ? 'green' : progress >= 40 ? 'orange' : 'red'}
                      showLabel
                      label="Syllabus Reviewed"
                    />
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {exam.syllabus.length}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Chapters</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {exam.importantTopics.length}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Key Topics</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {exam.studyResources.length}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Resources</div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedExam(exam);
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Details & Prepare
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Exams */}
      {pastExams.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Past Exams</h2>
          <div className="space-y-3">
            {pastExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 opacity-75"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">{exam.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{formatDateShort(exam.date)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Exam Detail Component
interface ExamDetailProps {
  exam: Exam;
  subjects: Subject[];
  onBack: () => void;
}

const ExamDetail: React.FC<ExamDetailProps> = ({ exam, subjects, onBack }) => {
  const [syllabusProgress, setSyllabusProgress] = useState(exam.syllabus);

  const toggleTopicReviewed = (chapterIndex: number) => {
    const newProgress = [...syllabusProgress];
    newProgress[chapterIndex] = {
      ...newProgress[chapterIndex],
      reviewed: !newProgress[chapterIndex].reviewed
    };
    setSyllabusProgress(newProgress);
  };

  const progress = calculateExamProgress({ ...exam, syllabus: syllabusProgress });
  const daysUntil = getDaysUntilExam(exam.date);

  return (
    <div className="space-y-6 pb-4">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
      >
        ← Back to Exams
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        {/* Header */}
        <div className="mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4 ${
            daysUntil <= 3 ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400' :
            'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
          }`}>
            <Clock className="w-5 h-5" />
            <span className="font-semibold text-xl">
              {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow!' : `${daysUntil} days remaining`}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{exam.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{formatDateShort(exam.date)} at {exam.time}</span>
            <span>Duration: {exam.duration} minutes</span>
            <span>{exam.location}</span>
            <span>{exam.professor}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <ProgressBar
            value={progress}
            color={progress >= 70 ? 'green' : progress >= 40 ? 'orange' : 'red'}
            showLabel
            label="Syllabus Coverage"
          />
        </div>

        {/* Syllabus */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Book className="w-5 h-5" />
            Syllabus
          </h2>
          <div className="space-y-3">
            {syllabusProgress.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.reviewed}
                    onChange={() => toggleTopicReviewed(index)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white mb-1">{item.chapter}</div>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                      {item.topics.map((topic, i) => (
                        <li key={i}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Exam Format */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Exam Format</h2>
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 space-y-2">
            {exam.format.mcqs && <p className="text-sm text-gray-700 dark:text-gray-300">• {exam.format.mcqs} MCQs</p>}
            {exam.format.codingProblems && <p className="text-sm text-gray-700 dark:text-gray-300">• {exam.format.codingProblems} Coding Problems</p>}
            {exam.format.theoryQuestions && <p className="text-sm text-gray-700 dark:text-gray-300">• {exam.format.theoryQuestions} Theory Questions</p>}
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">{exam.format.marksDistribution}</p>
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Rules:</p>
              {exam.format.rules.map((rule, i) => (
                <p key={i} className="text-sm text-gray-700 dark:text-gray-300">• {rule}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Important Topics */}
        {exam.importantTopics.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Important Topics (Professor Emphasized)
            </h2>
            <div className="space-y-3">
              {exam.importantTopics.map((topic, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 ${
                    topic.importance === 'high' ? 'bg-red-50 dark:bg-red-950/30 border-l-4 border-l-red-500' :
                    topic.importance === 'medium' ? 'bg-orange-50 dark:bg-orange-950/30 border-l-4 border-l-orange-500' :
                    'bg-gray-50 dark:bg-gray-700/50 border-l-4 border-l-gray-400'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{topic.topic}</h3>
                    <span className={`text-xs px-2 py-1 rounded uppercase font-semibold ${
                      topic.importance === 'high' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' :
                      topic.importance === 'medium' ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300' :
                      'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {topic.importance}
                    </span>
                  </div>
                  <blockquote className="text-sm italic text-gray-700 dark:text-gray-300 mb-2 pl-3 border-l-2 border-gray-300 dark:border-gray-600">
                    "{topic.professorQuote}"
                  </blockquote>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    {topic.lectureReference.date} at {topic.lectureReference.timestamp}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Resources */}
        {exam.studyResources.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Study Resources</h2>
            <div className="space-y-2">
              {exam.studyResources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Book className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900 dark:text-white">{resource.title}</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 ml-auto" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Generate Study Plan
          </button>
          <button className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            Practice Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
