import { useState, useCallback, useEffect, useMemo } from 'react';
import { SlotAssignment, SLOT_COLORS, findClashingSlots, getRelatedSlotCodes, findAllClashingSlotCodes } from '@/types/timetable';

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

  // Get all clashing slot codes for disabling in UI
  const clashingSlotCodes = useMemo(() => {
    const assignedSlots = Object.keys(data.assignments);
    return findAllClashingSlotCodes(assignedSlots);
  }, [data.assignments]);

  const assignSlot = useCallback((
    slotCode: string,
    courseCode: string,
    courseName: string,
    professorName: string,
    colorTag?: string
  ) => {
    // Get all related slots (e.g., for A1, get A1/SE2, A1/SF2, A1/SB2, etc.)
    const relatedSlots = getRelatedSlotCodes(slotCode);
    
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
          slots: relatedSlots,
        };
        courses.push(course);
      } else {
        // Update existing course slots
        color = course.color;
        courses = courses.map(c => 
          c.code === courseCode 
            ? { ...c, slots: [...new Set([...c.slots, ...relatedSlots])] }
            : c
        );
      }

      // Create assignments for all related slots
      const newAssignments = { ...prev.assignments };
      for (const slot of relatedSlots) {
        newAssignments[slot] = {
          courseCode,
          courseName,
          professorName,
          colorTag: color!,
        };
      }

      return {
        ...prev,
        courses,
        assignments: newAssignments,
      };
    });
  }, [nextColorIndex]);

  const clearSlot = useCallback((slotCode: string) => {
    // Get all related slots to clear them all
    const relatedSlots = getRelatedSlotCodes(slotCode);
    
    setData(prev => {
      const assignment = prev.assignments[slotCode];
      if (!assignment) return prev;

      const newAssignments = { ...prev.assignments };
      // Delete all related slots
      for (const slot of relatedSlots) {
        delete newAssignments[slot];
      }

      // Update course slots
      const courses = prev.courses.map(c => {
        if (c.code === assignment.courseCode) {
          return { ...c, slots: c.slots.filter(s => !relatedSlots.includes(s)) };
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

  // Check for clashing slots based on time overlap (theory and lab)
  const getSlotClashes = useCallback((slotCode: string): string[] => {
    const assignedSlots = Object.keys(data.assignments);
    
    // If this slot is already assigned, it's a clash with itself
    if (data.assignments[slotCode]) {
      return [slotCode];
    }
    
    // Find time-based clashes with other assigned slots
    return findClashingSlots(slotCode, assignedSlots);
  }, [data.assignments]);

  // Check if a specific slot is clashing (for disabling in UI)
  const isSlotClashing = useCallback((slotCode: string): boolean => {
    return clashingSlotCodes.has(slotCode);
  }, [clashingSlotCodes]);

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
    isSlotClashing,
    isSlotAssigned,
    getAssignment,
    exportData,
    importData,
  };
}
