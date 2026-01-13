import type { TimetableEntry, Lecture, Assignment } from '../types';

/**
 * Auto-generate lectures and assignments from timetable based on current date
 */

// Days of week mapping
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Get the day of week for a given date
 */
function getDayName(date: Date): string {
  return DAYS[date.getDay()];
}

/**
 * Generate lectures for the next N weeks based on timetable
 */
export function generateLecturesFromTimetable(
  timetable: TimetableEntry[],
  weeksAhead: number = 4,
  startDate: Date = new Date()
): Lecture[] {
  const lectures: Lecture[] = [];
  const today = new Date(startDate);
  today.setHours(0, 0, 0, 0);
  
  // Generate lectures for each week
  for (let week = 0; week < weeksAhead; week++) {
    // For each day in the week
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + (week * 7) + day);
      const dayName = getDayName(currentDate);
      
      // Find all timetable entries for this day
      const dayEntries = timetable.filter(entry => entry.day === dayName);
      
      // Create lecture for each entry
      dayEntries.forEach((entry, index) => {
        const lectureDate = currentDate.toISOString().split('T')[0];
        const lectureId = `lec-auto-${lectureDate}-${entry.id}`;
        
        // Determine status based on date
        const now = new Date();
        const lectureDateTime = new Date(`${lectureDate}T${entry.startTime}`);
        const lectureEndTime = new Date(`${lectureDate}T${entry.endTime}`);
        
        let status: 'upcoming' | 'live' | 'completed';
        if (now > lectureEndTime) {
          status = 'completed';
        } else if (now >= lectureDateTime && now <= lectureEndTime) {
          status = 'live';
        } else {
          status = 'upcoming';
        }
        
        // Calculate duration in minutes
        const [startHour, startMin] = entry.startTime.split(':').map(Number);
        const [endHour, endMin] = entry.endTime.split(':').map(Number);
        const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
        
        lectures.push({
          id: lectureId,
          batchId: 'batch-cs-2024',
          subjectId: entry.subjectId,
          title: `${dayName} Lecture - Week ${week + 1}`,
          date: lectureDate,
          startTime: entry.startTime,
          endTime: entry.endTime,
          duration,
          room: entry.room,
          professor: entry.professor,
          recordingDevices: Math.floor(Math.random() * 8) + 4, // 4-12 devices
          status,
          isNew: status === 'upcoming' && week === 0 && day <= 7,
          isExamRelevant: Math.random() > 0.5,
        });
      });
    }
  }
  
  return lectures.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Generate assignments based on lectures
 * Typically 1 assignment per subject every 2 weeks
 */
export function generateAssignmentsFromTimetable(
  timetable: TimetableEntry[],
  lectures: Lecture[],
  weeksAhead: number = 4
): Assignment[] {
  const assignments: Assignment[] = [];
  const subjectIds = [...new Set(timetable.map(t => t.subjectId))];
  
  // For each subject, create assignments every 2 weeks
  subjectIds.forEach((subjectId, idx) => {
    const subjectLectures = lectures.filter(l => l.subjectId === subjectId && l.status === 'completed');
    
    for (let week = 0; week < weeksAhead; week += 2) {
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + ((week + 2) * 7)); // Due 2 weeks from assignment week
      
      const assignmentDate = new Date(today);
      assignmentDate.setDate(today.getDate() + (week * 7));
      
      // Find a lecture from this subject in the assignment week
      const relevantLecture = subjectLectures.find(l => {
        const lecDate = new Date(l.date);
        return lecDate >= assignmentDate && lecDate < new Date(assignmentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      });
      
      const assignmentId = `asn-auto-${subjectId}-week-${week + 1}`;
      
      // Determine status
      const now = new Date();
      let status: 'pending' | 'submitted' | 'graded' | 'overdue';
      if (now > dueDate) {
        status = Math.random() > 0.3 ? 'graded' : 'overdue';
      } else if (now > new Date(dueDate.getTime() - 7 * 24 * 60 * 60 * 1000)) {
        status = Math.random() > 0.5 ? 'submitted' : 'pending';
      } else {
        status = 'pending';
      }
      
      assignments.push({
        id: assignmentId,
        batchId: 'batch-cs-2024',
        subjectId,
        title: `Assignment ${Math.floor(week / 2) + 1}`,
        description: `Complete the tasks related to topics covered in Week ${week + 1}.`,
        requirements: [
          'Submit code implementation',
          'Include documentation',
          'Add test cases',
          'Write analysis report'
        ],
        announcedInLecture: relevantLecture ? {
          lectureId: relevantLecture.id,
          timestamp: '00:45:00'
        } : undefined,
        dueDate: dueDate.toISOString(),
        submissionFormat: ['PDF', 'Code (ZIP)'],
        status,
        type: idx % 3 === 0 ? 'lab' : 'assignment',
        labComponents: idx % 3 === 0 ? {
          codeSubmission: true,
          physicalRecord: true
        } : undefined,
        batchStats: {
          submitted: Math.floor(Math.random() * 80) + 20,
          total: 120,
          avgTime: `${Math.floor(Math.random() * 48) + 12}h`
        }
      });
    }
  });
  
  return assignments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

/**
 * Merge auto-generated data with existing mock data
 */
export function mergeScheduleData<T extends { id: string }>(
  existingData: T[],
  autoGeneratedData: T[]
): T[] {
  const existingIds = new Set(existingData.map(item => item.id));
  const newItems = autoGeneratedData.filter(item => !existingIds.has(item.id));
  
  return [...existingData, ...newItems];
}
