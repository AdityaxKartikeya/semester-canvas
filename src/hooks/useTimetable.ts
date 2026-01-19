import { useState, useCallback, useEffect } from 'react';
import { SlotAssignment, SLOT_COLORS } from '@/types/timetable';

const STORAGE_KEY = 'ffcs-timetable-data';

export interface TimetableData {
  assignments: Record<string, SlotAssignment>;
  courses: Array<{
    id: string;
    name: string;
    code: string;
    professor: string;
    color: string;
    slots: string[];
  }>;
}

const getInitialData = (): TimetableData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load timetable data:', e);
  }
  return { assignments: {}, courses: [] };
};

export function useTimetable() {
  const [data, setData] = useState<TimetableData>(getInitialData);
  const [nextColorIndex, setNextColorIndex] = useState(0);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const assignSlot = useCallback((
    slotCode: string,
    courseCode: string,
    courseName: string,
    professorName: string,
    colorTag?: string
  ) => {
    setData(prev => {
      // Find if this course already exists
      let course = prev.courses.find(c => c.code === courseCode);
      let courses = [...prev.courses];
      let color = colorTag;

      if (!course) {
        // Create new course
        color = colorTag || SLOT_COLORS[nextColorIndex % SLOT_COLORS.length];
        setNextColorIndex(i => i + 1);
        course = {
          id: crypto.randomUUID(),
          name: courseName,
          code: courseCode,
          professor: professorName,
          color,
          slots: [slotCode],
        };
        courses.push(course);
      } else {
        // Update existing course slots
        color = course.color;
        courses = courses.map(c => 
          c.code === courseCode 
            ? { ...c, slots: [...new Set([...c.slots, slotCode])] }
            : c
        );
      }

      return {
        ...prev,
        courses,
        assignments: {
          ...prev.assignments,
          [slotCode]: {
            courseCode,
            courseName,
            professorName,
            colorTag: color!,
          },
        },
      };
    });
  }, [nextColorIndex]);

  const clearSlot = useCallback((slotCode: string) => {
    setData(prev => {
      const assignment = prev.assignments[slotCode];
      if (!assignment) return prev;

      const newAssignments = { ...prev.assignments };
      delete newAssignments[slotCode];

      // Update course slots
      const courses = prev.courses.map(c => {
        if (c.code === assignment.courseCode) {
          return { ...c, slots: c.slots.filter(s => s !== slotCode) };
        }
        return c;
      }).filter(c => c.slots.length > 0);

      return { assignments: newAssignments, courses };
    });
  }, []);

  const clearAll = useCallback(() => {
    setData({ assignments: {}, courses: [] });
    setNextColorIndex(0);
  }, []);

  const getSlotClashes = useCallback((slotCode: string): string[] => {
    // Find all occurrences of this slot code in the timetable
    // If already assigned, it's a clash
    if (data.assignments[slotCode]) {
      return [slotCode];
    }
    return [];
  }, [data.assignments]);

  const isSlotAssigned = useCallback((slotCode: string): boolean => {
    return !!data.assignments[slotCode];
  }, [data.assignments]);

  const getAssignment = useCallback((slotCode: string): SlotAssignment | undefined => {
    return data.assignments[slotCode];
  }, [data.assignments]);

  const exportData = useCallback((): string => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const importData = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString) as TimetableData;
      setData(parsed);
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }, []);

  return {
    assignments: data.assignments,
    courses: data.courses,
    assignSlot,
    clearSlot,
    clearAll,
    getSlotClashes,
    isSlotAssigned,
    getAssignment,
    exportData,
    importData,
  };
}
