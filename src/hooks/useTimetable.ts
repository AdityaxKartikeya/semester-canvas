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
  slotPreferences?: Record<string, string>;
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

  const [slotPreferences, setSlotPreferences] = useState<Record<string, string>>(() => {
    return data.slotPreferences || {};
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, slotPreferences }));
  }, [data, slotPreferences]);

  // Update data state when slotPreferences changes to ensure persistence includes it
  useEffect(() => {
    setData(prev => ({ ...prev, slotPreferences }));
  }, [slotPreferences]);

  // Get all clashing slot codes for disabling in UI
  const clashingSlotCodes = useMemo(() => {
    const assignedSlots = Object.keys(data.assignments);
    return findAllClashingSlotCodes(assignedSlots);
  }, [data.assignments]);

  const setSlotPreference = useCallback((originalSlot: string, preferredSlot: string) => {
    setSlotPreferences(prev => ({
      ...prev,
      [originalSlot]: preferredSlot
    }));
  }, []);

  const resolveSlot = useCallback((slotCode: string | null): string | null => {
    if (!slotCode) return null;
    return slotPreferences[slotCode] || slotCode;
  }, [slotPreferences]);

  const assignSlot = useCallback((
    slotCode: string,
    courseCode: string,
    courseName: string,
    professorName: string,
    colorTag?: string
  ) => {
    // Get all related slots (e.g., for A1, get A1/SE2, A1/SF2, A1/SB2, etc.)
    const resolvedSlot = resolveSlot(slotCode)!;
    const relatedSlots = getRelatedSlotCodes(resolvedSlot);

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
        // Update existing course - use new color if provided, otherwise keep existing
        color = colorTag || course.color;
        courses = courses.map(c =>
          c.code === courseCode
            ? { ...c, name: courseName, professor: professorName, color, slots: [...new Set([...c.slots, ...relatedSlots])] }
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

      // Also update all existing assignments for this course with the new color/details
      for (const [slot, assignment] of Object.entries(newAssignments)) {
        if (assignment.courseCode === courseCode) {
          newAssignments[slot] = {
            ...assignment,
            courseName,
            professorName,
            colorTag: color!,
          };
        }
      }

      return {
        ...prev,
        courses,
        assignments: newAssignments,
        slotPreferences // Maintain preferences
      };
    });
  }, [nextColorIndex, resolveSlot]);

  const clearSlot = useCallback((slotCode: string) => {
    const resolvedSlot = resolveSlot(slotCode)!;
    // Get all related slots to clear them all
    const relatedSlots = getRelatedSlotCodes(resolvedSlot);

    setData(prev => {
      const assignment = prev.assignments[resolvedSlot];
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

      return { assignments: newAssignments, courses, slotPreferences: prev.slotPreferences };
    });
  }, [resolveSlot]);

  const clearAll = useCallback(() => {
    setData({ assignments: {}, courses: [], slotPreferences: {} });
    setSlotPreferences({});
    setNextColorIndex(0);
  }, []);

  // Check for clashing slots based on time overlap (theory and lab)
  const getSlotClashes = useCallback((slotCode: string): string[] => {
    const resolvedSlot = resolveSlot(slotCode)!;
    const assignedSlots = Object.keys(data.assignments);

    // If this slot is already assigned, it's a clash with itself
    if (data.assignments[resolvedSlot]) {
      return [resolvedSlot];
    }

    // Find time-based clashes with other assigned slots
    return findClashingSlots(resolvedSlot, assignedSlots);
  }, [data.assignments, resolveSlot]);

  // Check if a specific slot is clashing (for disabling in UI)
  const isSlotClashing = useCallback((slotCode: string): boolean => {
    const resolvedSlot = resolveSlot(slotCode)!;
    return clashingSlotCodes.has(resolvedSlot);
  }, [clashingSlotCodes, resolveSlot]);

  const isSlotAssigned = useCallback((slotCode: string): boolean => {
    const resolvedSlot = resolveSlot(slotCode)!;
    return !!data.assignments[resolvedSlot];
  }, [data.assignments, resolveSlot]);

  const getAssignment = useCallback((slotCode: string): SlotAssignment | undefined => {
    const resolvedSlot = resolveSlot(slotCode)!;
    return data.assignments[resolvedSlot];
  }, [data.assignments, resolveSlot]);

  const exportData = useCallback((): string => {
    return JSON.stringify({ ...data, slotPreferences }, null, 2);
  }, [data, slotPreferences]);

  const importData = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString) as TimetableData;
      setData(parsed);
      if (parsed.slotPreferences) {
        setSlotPreferences(parsed.slotPreferences);
      }
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }, []);

  return {
    assignments: data.assignments,
    courses: data.courses,
    slotPreferences,
    assignSlot,
    clearSlot,
    clearAll,
    getSlotClashes,
    isSlotClashing,
    isSlotAssigned,
    getAssignment,
    exportData,
    importData,
    setSlotPreference,
    resolveSlot,
  };
}
