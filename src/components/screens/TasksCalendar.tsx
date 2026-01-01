import React, { useState, useMemo, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle, MapPin, ChevronLeft, ChevronRight, List, CalendarDays } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import { formatDateShort, getTimeUntil, getDaysUntilExam } from '../../utils/helpers';
import type { Assignment, Exam, Subject, Screen } from '../../types';

interface TasksCalendarProps {
  assignments: Assignment[];
  exams: Exam[];
  subjects: Subject[];
  onNavigate?: (screen: Screen) => void;
}

type ViewMode = 'list' | 'calendar';
type ItemType = 'all' | 'assignment' | 'lab' | 'exam';

interface CalendarItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'assignment' | 'lab' | 'exam';
  subjectId: string;
  status?: string;
  isPast?: boolean;
  urgency?: 'critical' | 'high' | 'medium' | 'low';
  original: Assignment | Exam;
}

export const TasksCalendar: React.FC<TasksCalendarProps> = ({ assignments, exams, subjects, onNavigate }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [localAssignments, setLocalAssignments] = useState<Assignment[]>(assignments);

  useEffect(() => {
    setLocalAssignments(assignments);
  }, [assignments]);
  const [typeFilter, setTypeFilter] = useState<ItemType>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);

  const getSubjectName = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Unknown';
  };

  const getSubjectColor = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.color || '#3b82f6';
  };

  // Convert all items to calendar items
  const calendarItems: CalendarItem[] = useMemo(() => {
    const items: CalendarItem[] = [];

    // Add assignments
    localAssignments.forEach(assignment => {
      const dueDate = new Date(assignment.dueDate);
      const now = new Date();
      const diffDays = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      
      let urgency: 'critical' | 'high' | 'medium' | 'low' = 'low';
      if (assignment.status === 'overdue') urgency = 'critical';
      else if (diffDays <= 1) urgency = 'critical';
      else if (diffDays <= 3) urgency = 'high';
      else if (diffDays <= 7) urgency = 'medium';

      items.push({
        id: assignment.id,
        title: assignment.title,
        date: assignment.dueDate.split('T')[0],
        time: assignment.dueDate.split('T')[1]?.substring(0, 5),
        type: assignment.type as 'assignment' | 'lab',
        subjectId: assignment.subjectId,
        status: assignment.status,
        urgency,
        original: assignment
      });
    });

    // Add exams
    exams.forEach(exam => {
      const daysUntil = getDaysUntilExam(exam.date);
      let urgency: 'critical' | 'high' | 'medium' | 'low' = 'low';
      if (exam.isPast) urgency = 'low';
      else if (daysUntil <= 3) urgency = 'critical';
      else if (daysUntil <= 7) urgency = 'high';
      else urgency = 'medium';

      items.push({
        id: exam.id,
        title: exam.title,
        date: exam.date,
        time: exam.time,
        type: 'exam',
        subjectId: exam.subjectId,
        isPast: exam.isPast,
        urgency,
        original: exam
      });
    });

    return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [localAssignments, exams]);

  // Filter items
  const filteredItems = useMemo(() => {
    return calendarItems.filter(item => {
      if (typeFilter === 'all') return true;
      if (typeFilter === 'assignment') return item.type === 'assignment';
      if (typeFilter === 'lab') return item.type === 'lab';
      if (typeFilter === 'exam') return item.type === 'exam';
      return true;
    });
  }, [calendarItems, typeFilter]);

  // Get items for selected month
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthItems = filteredItems.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
  });

  const getItemsForDate = (day: number): CalendarItem[] => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredItems.filter(item => item.date === dateStr);
  };

  const handlePrevMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleMarkComplete = async (assignmentId: string) => {
    setLocalAssignments(prev => prev.map(a => 
      a.id === assignmentId ? { ...a, status: 'submitted' } : a
    ));
    // In a real app, this would make an API call
  };

  const handleAskAI = (item: CalendarItem) => {
    if (onNavigate) {
      onNavigate('chat');
    }
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="space-y-4 pb-4">
      {/* Header Controls */}
      <div className="bg-white dark:bg-[#171717] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-4 h-4 inline mr-2" />
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <CalendarDays className="w-4 h-4 inline mr-2" />
              Calendar
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'assignment', 'lab', 'exam'] as ItemType[]).map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                  typeFilter === type
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <ListView 
          items={filteredItems} 
          getSubjectName={getSubjectName}
          getSubjectColor={getSubjectColor}
          onMarkComplete={handleMarkComplete}
          onAskAI={handleAskAI}
          onSelectItem={setSelectedItem}
        />
      ) : (
        <CalendarView
          selectedDate={selectedDate}
          monthItems={monthItems}
          daysInMonth={daysInMonth}
          firstDayOfMonth={firstDayOfMonth}
          getItemsForDate={getItemsForDate}
          getSubjectColor={getSubjectColor}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onSelectItem={setSelectedItem}
          months={months}
        />
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          subjects={subjects}
          onClose={() => setSelectedItem(null)}
          onMarkComplete={handleMarkComplete}
          onAskAI={handleAskAI}
        />
      )}
    </div>
  );
};

// List View Component
interface ListViewProps {
  items: CalendarItem[];
  getSubjectName: (id: string) => string;
  getSubjectColor: (id: string) => string;
  onMarkComplete: (id: string) => void;
  onAskAI: (item: CalendarItem) => void;
  onSelectItem: (item: CalendarItem) => void;
}

const ListView: React.FC<ListViewProps> = ({ items, getSubjectName, getSubjectColor, onMarkComplete, onAskAI, onSelectItem }) => {
  const now = new Date();
  const upcoming = items.filter(item => !item.isPast && new Date(item.date) >= now);
  const past = items.filter(item => item.isPast || new Date(item.date) < now);

  const renderItem = (item: CalendarItem) => {
    const isAssignment = item.type === 'assignment' || item.type === 'lab';
    const urgencyColors = {
      critical: 'border-l-red-500 bg-red-50 dark:bg-red-950/20',
      high: 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20',
      medium: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20',
      low: 'border-l-gray-400 bg-gray-50 dark:bg-gray-950/20'
    };

    return (
      <div
        key={item.id}
        className={`bg-white dark:bg-[#171717] border-l-4 ${urgencyColors[item.urgency || 'low']} border border-gray-200 dark:border-gray-800 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow`}
        onClick={() => onSelectItem(item)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: getSubjectColor(item.subjectId) + '20', color: getSubjectColor(item.subjectId) }}
              >
                {getSubjectName(item.subjectId)}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-lg font-medium uppercase ${
                item.type === 'exam' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                item.type === 'lab' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              }`}>
                {item.type}
              </span>
              {isAssignment && item.status && <StatusBadge status={item.status} />}
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDateShort(item.date)}</span>
              {item.time && (
                <>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{item.time}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {isAssignment && item.status !== 'submitted' && item.status !== 'graded' && (
          <div className="flex gap-2 mt-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onMarkComplete(item.id);
              }}
              className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Complete
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAskAI(item);
              }}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Ask AI
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 px-1">
            Upcoming ({upcoming.length})
          </h3>
          <div className="space-y-3">
            {upcoming.map(renderItem)}
          </div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-3 px-1">
            Past ({past.length})
          </h3>
          <div className="space-y-3 opacity-60">
            {past.map(renderItem)}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="bg-white dark:bg-[#171717] border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
          <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No items found</p>
        </div>
      )}
    </div>
  );
};

// Calendar View Component
interface CalendarViewProps {
  selectedDate: Date;
  monthItems: CalendarItem[];
  daysInMonth: number;
  firstDayOfMonth: number;
  getItemsForDate: (day: number) => CalendarItem[];
  getSubjectColor: (id: string) => string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectItem: (item: CalendarItem) => void;
  months: string[];
}

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  monthItems,
  daysInMonth,
  firstDayOfMonth,
  getItemsForDate,
  getSubjectColor,
  onPrevMonth,
  onNextMonth,
  onSelectItem,
  months
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const dayItems = selectedDay ? getItemsForDate(selectedDay) : [];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="bg-white dark:bg-[#171717] border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={onPrevMonth}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNextMonth}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {/* Days of month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const items = getItemsForDate(day);
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === selectedDate.getMonth() && 
                           new Date().getFullYear() === selectedDate.getFullYear();
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                className={`aspect-square p-1 rounded-lg border transition-colors ${
                  isSelected 
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500' 
                    : isToday
                    ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700'
                    : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className={`text-sm font-medium ${
                  isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {day}
                </div>
                {items.length > 0 && (
                  <div className="flex gap-0.5 mt-1 justify-center flex-wrap">
                    {items.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: getSubjectColor(item.subjectId) }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day items */}
      {selectedDay && dayItems.length > 0 && (
        <div className="bg-white dark:bg-[#171717] border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {months[selectedDate.getMonth()]} {selectedDay}, {selectedDate.getFullYear()}
          </h3>
          <div className="space-y-2">
            {dayItems.map(item => (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium uppercase ${
                    item.type === 'exam' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                    item.type === 'lab' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  }`}>
                    {item.type}
                  </span>
                  {item.time && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white dark:bg-[#171717] border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">This Month</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {monthItems.filter(i => i.type === 'assignment').length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Assignments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {monthItems.filter(i => i.type === 'lab').length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Labs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {monthItems.filter(i => i.type === 'exam').length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Exams</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Item Detail Modal
interface ItemDetailModalProps {
  item: CalendarItem;
  subjects: Subject[];
  onClose: () => void;
  onMarkComplete: (id: string) => void;
  onAskAI: (item: CalendarItem) => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, subjects, onClose, onMarkComplete, onAskAI }) => {
  const isAssignment = item.type === 'assignment' || item.type === 'lab';
  const assignment = isAssignment ? (item.original as Assignment) : null;
  const exam = !isAssignment ? (item.original as Exam) : null;

  const getSubjectName = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Unknown';
  };

  const getSubjectColor = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.color || '#3b82f6';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-[#171717] rounded-2xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: getSubjectColor(item.subjectId) + '20', color: getSubjectColor(item.subjectId) }}
                >
                  {getSubjectName(item.subjectId)}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium uppercase ${
                  item.type === 'exam' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                  item.type === 'lab' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                }`}>
                  {item.type}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  {formatDateShort(item.date)}
                </span>
                {item.time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {item.time}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          {assignment && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{assignment.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {assignment.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              {assignment.latePolicy && (
                <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-300">
                      <span className="font-semibold">Late Policy:</span> {assignment.latePolicy}
                    </div>
                  </div>
                </div>
              )}

              {assignment.status !== 'submitted' && assignment.status !== 'graded' && (
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => {
                      onMarkComplete(item.id);
                      onClose();
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </button>
                  <button 
                    onClick={() => {
                      onAskAI(item);
                      onClose();
                    }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    Ask AI
                  </button>
                </div>
              )}
            </div>
          )}

          {exam && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {exam.duration} minutes
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {exam.location}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Syllabus</h3>
                <div className="space-y-2">
                  {exam.syllabus.map((item, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="font-medium text-sm text-gray-900 dark:text-white">{item.chapter}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {item.topics.join(' • ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  onAskAI(item);
                  onClose();
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Prepare with AI
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
