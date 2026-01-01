import React, { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle, Upload, ExternalLink, Users } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import { formatDateShort, getTimeUntil, getAssignmentStatusColor } from '../../utils/helpers';
import type { Assignment, Subject } from '../../types';

interface AssignmentsLabsProps {
  assignments: Assignment[];
  subjects: Subject[];
}

export const AssignmentsLabs: React.FC<AssignmentsLabsProps> = ({ assignments, subjects }) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'assignments' | 'labs'>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter assignments
  const filteredAssignments = assignments.filter((assignment) => {
    if (selectedTab === 'assignments' && assignment.type !== 'assignment') return false;
    if (selectedTab === 'labs' && assignment.type !== 'lab') return false;
    if (statusFilter !== 'all' && assignment.status !== statusFilter) return false;
    return true;
  });

  // Sort assignments
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === 'subject') {
      return a.subjectId.localeCompare(b.subjectId);
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  // Group assignments
  const overdue = sortedAssignments.filter(a => a.status === 'overdue');
  const dueSoon = sortedAssignments.filter(a => {
    if (a.status === 'submitted' || a.status === 'graded' || a.status === 'overdue') return false;
    const now = new Date();
    const dueDate = new Date(a.dueDate);
    const diffDays = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  });
  const upcoming = sortedAssignments.filter(a => {
    if (a.status !== 'pending') return false;
    const now = new Date();
    const dueDate = new Date(a.dueDate);
    const diffDays = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 7;
  });
  const submitted = sortedAssignments.filter(a => a.status === 'submitted' || a.status === 'graded');

  const getSubjectName = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Unknown';
  };

  const getSubjectColor = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.color || '#2196F3';
  };

  const renderAssignmentCard = (assignment: Assignment) => (
    <div
      key={assignment.id}
      className="bg-white dark:bg-[#171717] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 mb-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{ backgroundColor: getSubjectColor(assignment.subjectId) + '20', color: getSubjectColor(assignment.subjectId) }}
            >
              {getSubjectName(assignment.subjectId)}
            </span>
            <StatusBadge status={assignment.status} />
            {assignment.type === 'lab' && (
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2.5 py-1 rounded-lg font-medium">
                LAB
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {assignment.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {assignment.description}
          </p>
        </div>
      </div>

      {/* Due Date */}
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Due: {formatDateShort(assignment.dueDate)}
        </span>
        {assignment.status !== 'submitted' && assignment.status !== 'graded' && (
          <span className={`text-sm font-semibold ${
            assignment.status === 'overdue' ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'
          }`}>
            ({getTimeUntil(assignment.dueDate)})
          </span>
        )}
      </div>

      {/* Lecture Reference */}
      {assignment.announcedInLecture && (
        <div className="flex items-center gap-2 mb-3 text-sm text-blue-600 dark:text-blue-400">
          <ExternalLink className="w-4 h-4" />
          <button className="hover:underline">
            Announced in lecture at {assignment.announcedInLecture.timestamp}
          </button>
        </div>
      )}

      {/* Requirements */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Requirements:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          {assignment.requirements.slice(0, 3).map((req, i) => (
            <li key={i}>{req}</li>
          ))}
          {assignment.requirements.length > 3 && (
            <li className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
              +{assignment.requirements.length - 3} more
            </li>
          )}
        </ul>
      </div>

      {/* Important Notes */}
      {assignment.latePolicy && (
        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-300">
              <span className="font-semibold">Late Policy:</span> {assignment.latePolicy}
            </div>
          </div>
        </div>
      )}

      {/* Submission Format */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Submission Format:</h4>
        <div className="flex flex-wrap gap-2">
          {assignment.submissionFormat.map((format, i) => (
            <span key={i} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
              {format}
            </span>
          ))}
        </div>
      </div>

      {/* Lab Components */}
      {assignment.type === 'lab' && assignment.labComponents && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Lab Components:</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={assignment.labComponents.codeSubmission}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                readOnly
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Code Submission</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={assignment.labComponents.physicalRecord}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                readOnly
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Physical Lab Record</span>
            </label>
          </div>
        </div>
      )}

      {/* Batch Insights */}
      {assignment.batchStats && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-semibold">{assignment.batchStats.submitted}/{assignment.batchStats.total}</span> students submitted
            {assignment.batchStats.avgTime && (
              <span className="ml-2">• Avg time: {assignment.batchStats.avgTime}</span>
            )}
          </div>
        </div>
      )}

      {/* Submission Status */}
      {assignment.status === 'submitted' && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg mb-4">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div className="text-sm text-green-800 dark:text-green-300">
            Submitted on {formatDateShort(assignment.submittedAt || '')}
            {assignment.grade && <span className="ml-2 font-semibold">• Grade: {assignment.grade}/100</span>}
          </div>
        </div>
      )}

      {/* Actions */}
      {assignment.status !== 'submitted' && assignment.status !== 'graded' && (
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Mark Complete
          </button>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
            Ask AI
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4 pb-4">
      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedTab('assignments')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === 'assignments'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Assignments
          </button>
          <button
            onClick={() => setSelectedTab('labs')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === 'labs'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Lab Records
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="dueDate">By Due Date</option>
          <option value="subject">By Subject</option>
          <option value="status">By Status</option>
        </select>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="submitted">Submitted</option>
          <option value="overdue">Overdue</option>
          <option value="graded">Graded</option>
        </select>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Completion Progress
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {submitted.length}/{assignments.length}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${(submitted.length / assignments.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Overdue Section */}
      {overdue.length > 0 && (
        <div>
          <div className="bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-lg mb-3">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Overdue ({overdue.length})
            </h3>
          </div>
          {overdue.map(renderAssignmentCard)}
        </div>
      )}

      {/* Due Soon Section */}
      {dueSoon.length > 0 && (
        <div>
          <div className="bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-lg mb-3">
            <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-300 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Due Soon ({dueSoon.length})
            </h3>
          </div>
          {dueSoon.map(renderAssignmentCard)}
        </div>
      )}

      {/* Upcoming Section */}
      {upcoming.length > 0 && (
        <div>
          <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg mb-3">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300">
              Upcoming ({upcoming.length})
            </h3>
          </div>
          {upcoming.map(renderAssignmentCard)}
        </div>
      )}

      {/* Submitted Section */}
      {submitted.length > 0 && (
        <div>
          <div className="bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-lg mb-3">
            <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Submitted ({submitted.length})
            </h3>
          </div>
          {submitted.map(renderAssignmentCard)}
        </div>
      )}

      {sortedAssignments.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No assignments found</p>
        </div>
      )}
    </div>
  );
};