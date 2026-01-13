import type { TimetableEntry, Lecture, Assignment, Subject } from '../types';

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function parseTimeToMinutes(t: string) {
  const [hh, mm] = t.split(':').map(Number);
  return hh * 60 + (mm || 0);
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const DAY_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export function generateFromTimetable(
  timetable: TimetableEntry[],
  subjects: Subject[],
  options?: { weeksAhead?: number; batchId?: string }
): { lectures: Lecture[]; assignments: Assignment[] } {
  const weeksAhead = options?.weeksAhead ?? 6;
  const batchId = options?.batchId ?? 'batch-cs-2024';
  const today = new Date();
  const endDate = addDays(today, weeksAhead * 7);

  const lectures: Lecture[] = [];
  const assignments: Assignment[] = [];

  // Iterate through each date from today -> endDate
  for (let d = new Date(today); d <= endDate; d = addDays(d, 1)) {
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    for (const entry of timetable) {
      if (entry.day.toLowerCase() === dayName.toLowerCase()) {
        const subject = subjects.find((s) => s.id === entry.subjectId);
        if (!subject) continue;

        const dateStr = formatDate(d);
        const lectureId = `auto-${entry.subjectId}-${dateStr}`;

        const startMinutes = parseTimeToMinutes(entry.startTime);
        const endMinutes = parseTimeToMinutes(entry.endTime);
        const duration = Math.max(0, endMinutes - startMinutes);

        const lecture: Lecture = {
          id: lectureId,
          batchId,
          subjectId: entry.subjectId,
          title: `${subject.name} - Lecture`,
          date: dateStr,
          startTime: entry.startTime,
          endTime: entry.endTime,
          duration,
          room: entry.room || 'TBD',
          professor: entry.professor || subject.teacher || 'TBD',
          recordingDevices: 0,
          status: new Date(dateStr) < new Date(formatDate(today)) ? 'completed' : 'upcoming',
        };

        lectures.push(lecture);

        // Create a sample assignment due 7 days after lecture
        const due = addDays(d, 7);
        const assignmentId = `auto-asn-${entry.subjectId}-${dateStr}`;
        const assignment = {
          id: assignmentId,
          batchId,
          subjectId: entry.subjectId,
          title: `${subject.name} - Weekly Homework (${dateStr})`,
          description: `Auto-generated homework for ${subject.name} lecture on ${dateStr}`,
          requirements: ['Review lecture notes', 'Solve practice problems', 'Submit solution in PDF'],
          dueDate: `${formatDate(due)}T23:59:00`,
          submissionFormat: ['PDF'],
          status: 'pending',
          type: 'assignment',
        } as Assignment;

        assignments.push(assignment);
      }
    }
  }

  return { lectures, assignments };
}
