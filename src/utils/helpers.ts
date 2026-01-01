// Utility functions for Smart Lecture Notes

import type { Assignment, Exam } from '../types';

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options).toUpperCase();
};

/**
 * Format date to short readable string (e.g., "Jan 15, 2026")
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format time to 12-hour format
 */
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Calculate time difference from now
 */
export const getTimeUntil = (dateString: string): string => {
  const now = new Date();
  const target = new Date(dateString);
  const diffMs = target.getTime() - now.getTime();
  
  if (diffMs < 0) {
    const absDiffMs = Math.abs(diffMs);
    const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} overdue`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''} overdue`;
  }
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `in ${days} day${days > 1 ? 's' : ''}`;
  }
  if (hours > 0) {
    return `in ${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
};

/**
 * Get assignment status color class
 */
export const getAssignmentStatusColor = (assignment: Assignment): string => {
  if (assignment.status === 'overdue') {
    return 'bg-red-50 border-l-4 border-l-red-500 dark:bg-red-950/30';
  }
  
  if (assignment.status === 'submitted') {
    return 'bg-green-50 border-l-4 border-l-green-500 dark:bg-green-950/30';
  }
  
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);
  const diffDays = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  
  if (diffDays <= 1) {
    return 'bg-red-50 border-l-4 border-l-red-500 dark:bg-red-950/30';
  }
  if (diffDays <= 7) {
    return 'bg-orange-50 border-l-4 border-l-orange-500 dark:bg-orange-950/30';
  }
  return 'bg-white border-l-4 border-l-gray-300 dark:bg-gray-800 dark:border-l-gray-600';
};

/**
 * Get days until exam
 */
export const getDaysUntilExam = (examDate: string): number => {
  const now = new Date();
  const target = new Date(examDate);
  const diffMs = target.getTime() - now.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Calculate exam progress percentage
 */
export const calculateExamProgress = (exam: Exam): number => {
  const total = exam.syllabus.length;
  const reviewed = exam.syllabus.filter(item => item.reviewed).length;
  return Math.round((reviewed / total) * 100);
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

/**
 * Check if date is today
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Get urgency level for deadline
 */
export const getUrgencyLevel = (dueDate: string): 'critical' | 'high' | 'medium' | 'low' => {
  const now = new Date();
  const target = new Date(dueDate);
  const diffHours = (target.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (diffHours < 0) return 'critical';
  if (diffHours <= 24) return 'critical';
  if (diffHours <= 72) return 'high';
  if (diffHours <= 168) return 'medium';
  return 'low';
};
