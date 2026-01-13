import React, { useState, useMemo, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle, MapPin, ChevronLeft, ChevronRight, List, CalendarDays, Sparkles, X } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import { formatDateShort, getTimeUntil, getDaysUntilExam } from '../../utils/helpers';
import type { Assignment, Exam, Subject, Screen } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

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
  };

  const handleAskAI = (item: CalendarItem) => {
    if (onNavigate) {
      onNavigate('chat');
    }
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <motion.div
      className="space-y-4 px-4 pb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Controls */}
      <div className="pt-2 space-y-3">
        {/* View Mode Toggle */}
        <div className="bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl inline-flex">
          <motion.button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'list'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            whileTap={{ scale: 0.95 }}
          >
            <List className="w-4 h-4" />
            List
          </motion.button>
          <motion.button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'calendar'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            whileTap={{ scale: 0.95 }}
          >
            <CalendarDays className="w-4 h-4" />
            Calendar
          </motion.button>
        </div>

        {/* Type Filter Chips */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'assignment', 'lab', 'exam'] as ItemType[]).map(type => (
            <motion.button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${typeFilter === type
                  ? type === 'exam'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : type === 'lab'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                      : type === 'assignment'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              whileTap={{ scale: 0.95 }}
            >
              {type === 'all' ? 'All' : type}
            </motion.button>
          ))}
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
      <AnimatePresence>
        {selectedItem && (
          <ItemDetailModal
            item={selectedItem}
            subjects={subjects}
            onClose={() => setSelectedItem(null)}
            onMarkComplete={handleMarkComplete}
            onAskAI={handleAskAI}
          />
        )}
      </AnimatePresence>
    </motion.div>
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

  const urgencyStyles = {
    critical: 'border-l-red-500 bg-gradient-to-r from-red-50 to-transparent dark:from-red-950/20',
    high: 'border-l-amber-500 bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/20',
    medium: 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20',
    low: 'border-l-gray-300 dark:border-l-gray-600'
  };

  const renderItem = (item: CalendarItem, index: number) => {
    const isAssignment = item.type === 'assignment' || item.type === 'lab';

    return (
      <motion.div
        key={item.id}
        className={`bg-white dark:bg-[#171717] border-l-4 ${urgencyStyles[item.urgency || 'low']} border border-gray-100 dark:border-gray-800 rounded-2xl p-4 cursor-pointer hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all`}
        onClick={() => onSelectItem(item)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ x: 4 }}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className="text-xs font-bold px-2 py-1 rounded-lg"
                style={{ backgroundColor: getSubjectColor(item.subjectId) + '15', color: getSubjectColor(item.subjectId) }}
              >
                {getSubjectName(item.subjectId)}
              </span>
              <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase ${item.type === 'exam' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                  item.type === 'lab' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                }`}>
                {item.type}
              </span>
              {isAssignment && item.status && <StatusBadge status={item.status} />}
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {item.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                {formatDateShort(item.date)}
              </span>
              {item.time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {item.time}
                </span>
              )}
            </div>
          </div>
        </div>

        {isAssignment && item.status !== 'submitted' && item.status !== 'graded' && (
          <div className="flex gap-2 mt-3">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onMarkComplete(item.id);
              }}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Complete
            </motion.button>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onAskAI(item);
              }}
              className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-500/20"
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI
            </motion.button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
              Upcoming ({upcoming.length})
            </h3>
          </div>
          <div className="space-y-3">
            {upcoming.map((item, index) => renderItem(item, index))}
          </div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wide">
            Past ({past.length})
          </h3>
          <div className="space-y-3 opacity-50">
            {past.map((item, index) => renderItem(item, index))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <motion.div
          className="bg-white dark:bg-[#171717] border border-gray-100 dark:border-gray-800 rounded-2xl p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No items found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters</p>
        </motion.div>
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
      {/* Calendar */}
      <div className="bg-white dark:bg-[#171717] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 overflow-hidden">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </h2>
          <div className="flex gap-1">
            <motion.button
              onClick={onPrevMonth}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={onNextMonth}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 py-2 uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const items = getItemsForDate(day);
            const isToday = new Date().getDate() === day &&
              new Date().getMonth() === selectedDate.getMonth() &&
              new Date().getFullYear() === selectedDate.getFullYear();
            const isSelected = selectedDay === day;
            const hasItems = items.length > 0;

            return (
              <motion.button
                key={day}
                onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                className={`aspect-square p-1 rounded-xl relative transition-all ${isSelected
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : isToday
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : hasItems
                        ? 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                whileTap={{ scale: 0.9 }}
              >
                <div className={`text-xs font-semibold ${isSelected ? 'text-white' : ''}`}>
                  {day}
                </div>
                {hasItems && !isSelected && (
                  <div className="flex gap-0.5 mt-0.5 justify-center">
                    {items.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: getSubjectColor(item.subjectId) }}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected day items */}
      <AnimatePresence>
        {selectedDay && dayItems.length > 0 && (
          <motion.div
            className="bg-white dark:bg-[#171717] border border-gray-100 dark:border-gray-800 rounded-2xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              {months[selectedDate.getMonth()]} {selectedDay}
            </h3>
            <div className="space-y-2">
              {dayItems.map(item => (
                <motion.button
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${item.type === 'exam' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                        item.type === 'lab' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                          'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }`}>
                      {item.type}
                    </span>
                    {item.time && (
                      <span className="text-[10px] text-gray-400">{item.time}</span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Month Summary */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">This Month</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-3">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {monthItems.filter(i => i.type === 'assignment').length}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase">Assignments</div>
          </div>
          <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {monthItems.filter(i => i.type === 'lab').length}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase">Labs</div>
          </div>
          <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-3">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {monthItems.filter(i => i.type === 'exam').length}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase">Exams</div>
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
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-[#171717] rounded-t-3xl sm:rounded-2xl border-t sm:border border-gray-200 dark:border-gray-800 w-full sm:max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Handle bar for mobile */}
        <div className="flex justify-center pt-3 pb-2 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: getSubjectColor(item.subjectId) + '15', color: getSubjectColor(item.subjectId) }}
                >
                  {getSubjectName(item.subjectId)}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-bold uppercase ${item.type === 'exam' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                    item.type === 'lab' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  }`}>
                  {item.type}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
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
            <motion.button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Content */}
          {assignment && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{assignment.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Requirements</h3>
                <ul className="space-y-1.5">
                  {assignment.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {assignment.latePolicy && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/30 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800 dark:text-amber-300">
                      <span className="font-semibold">Late Policy:</span> {assignment.latePolicy}
                    </div>
                  </div>
                </div>
              )}

              {assignment.status !== 'submitted' && assignment.status !== 'graded' && (
                <div className="flex gap-2 pt-2">
                  <motion.button
                    onClick={() => {
                      onMarkComplete(item.id);
                      onClose();
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      onAskAI(item);
                      onClose();
                    }}
                    className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Help
                  </motion.button>
                </div>
              )}
            </div>
          )}

          {exam && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{exam.duration} min</span>
                </span>
                <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{exam.location}</span>
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Syllabus</h3>
                <div className="space-y-2">
                  {exam.syllabus.map((item, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">{item.chapter}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.topics.join(' • ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={() => {
                  onAskAI(item);
                  onClose();
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-4 h-4" />
                Prepare with AI
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
