export interface SlotAssignment {
  courseCode: string;
  courseName: string;
  professorName: string;
  colorTag: string;
}

export interface TimeSlot {
  id: string;
  slotCode: string;
  day: string;
  startTime: string;
  endTime: string;
  type: 'theory' | 'lab';
  rowSpan?: number;
  colSpan?: number;
  isLunch?: boolean;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  professor: string;
  slots: string[];
  color: string;
}

export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
export type Day = typeof DAYS[number];

// Theory: 5 morning slots + LUNCH + 5 afternoon slots
export const THEORY_TIMES = [
  '8.00-8.50',
  '9.00-9.50',
  '10.00-10.50',
  '11.00-11.50',
  '12.00-12.50',
  'LUNCH',
  '2.00-2.50',
  '3.00-3.50',
  '4.00-4.50',
  '5.00-5.50',
  '6.00-6.50',
] as const;

// Lab: 3 morning + 3 afternoon = 6 combined slots per day (labs are conducted in pairs)
export const LAB_TIMES = [
  '8.00-9.40',
  '9.50-11.30',
  '11.40-1.10',
  'LUNCH',
  '2.00-3.40',
  '3.50-5.30',
  '5.40-7.10',
] as const;

export const SLOT_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#84CC16', // Lime
] as const;

// Complete slot structure
export const TIMETABLE_STRUCTURE: Record<Day, { theory: (string | null)[]; lab: (string | null)[] }> = {
  MON: {
    theory: [null, 'TA1', 'TB1', 'E1', 'E1', 'TA2', 'TB2', 'E2', 'E2', null],
    lab: ['L61+L62', 'L63+L64', 'L65+L66', 'L67+L68', 'L69+L70', 'L71+L72'],
  },
  TUE: {
    theory: ['TFF1', 'A1/SE2', 'B1/SD2', 'C1', 'D1', 'F2', 'A2/SF1', 'B2/SC1', 'C2', 'TDD2'],
    lab: ['L1+L2', 'L3+L4', 'L5+L6', 'L31+L32', 'L33+L34', 'L35+L36'],
  },
  WED: {
    theory: ['TEE1', 'D1', 'F1', 'G1/TE1', 'B1/SC2', 'D2', 'F2', 'B2/SD1', 'G2/TE2', 'TG2'],
    lab: ['L7+L8', 'L9+L10', 'L11+L12', 'L37+L38', 'L39+L40', 'L41+L42'],
  },
  THU: {
    theory: ['TG1', 'C1', 'D1', 'A1/SB2', 'F1', 'E2', 'C2', 'A2/SB1', 'D2', 'TFF2'],
    lab: ['L13+L14', 'L15+L16', 'L17+L18', 'L43+L44', 'L45+L46', 'L47+L48'],
  },
  FRI: {
    theory: ['TDD1', 'B1/SA2', 'A1/SF2', 'G1/TF1', 'E1', 'TC2', 'B2/SA1', 'A2/SE1', 'G2/TF2', 'TEE2'],
    lab: ['L19+L20', 'L21+L22', 'L23+L24', 'L49+L50', 'L51+L52', 'L53+L54'],
  },
  SAT: {
    theory: [null, 'TC1', 'C1', 'F1', 'G1/TD1', 'G2/TD2', 'D2', 'F2', 'C2', null],
    lab: ['L25+L26', 'L27+L28', 'L29+L30', 'L55+L56', 'L57+L58', 'L59+L60'],
  },
};

// Theory slot combinations - when one slot is selected, all slots in the combination must be selected together
// Some slots have multiple possible combinations - user must choose one
export const THEORY_SLOT_COMBINATIONS: string[][] = [
  // Basic 2-slot combinations
  ['A1', 'TA1'],
  ['A2', 'TA2'],
  ['B1', 'TB1'],
  ['B2', 'TB2'],
  ['C1', 'TC1'],
  ['C2', 'TC2'],
  ['D1', 'TD1'],
  ['D2', 'TD2'],
  ['E1', 'TE1'],
  ['E2', 'TE2'],
  ['F1', 'TF1'],
  ['F2', 'TF2'],
  ['G1', 'TG1'],
  ['G2', 'TG2'],
  // D, E, F with double T slots
  ['D1', 'TDD1'],
  ['D2', 'TDD2'],
  ['E1', 'TEE1'],
  ['E2', 'TEE2'],
  ['F1', 'TFF1'],
  ['F2', 'TFF2'],
  // 3-slot combinations with S slots
  ['A1', 'SA1', 'TA1'],
  ['A2', 'SA2', 'TA2'],
  ['B1', 'SB1', 'TB1'],
  ['B2', 'SB2', 'TB2'],
  ['D1', 'SD1', 'TD1'],
  ['D2', 'SD2', 'TD2'],
  ['E1', 'SE1', 'TE1'],
  ['E2', 'SE2', 'TE2'],
  ['F1', 'SF1', 'TF1'],
  ['F2', 'SF2', 'TF2'],
  // 3-slot combinations with double T slots
  ['D1', 'TD1', 'TDD1'],
  ['D2', 'TD2', 'TDD2'],
  ['F1', 'TF1', 'TFF1'],
  ['F2', 'TF2', 'TFF2'],
  ['E2', 'TE2', 'TEE2'],
];

// Get all combinations that include a given slot
export function getSlotCombinations(slotCode: string): string[][] {
  return THEORY_SLOT_COMBINATIONS.filter(combo => combo.includes(slotCode));
}

// Get all slots in a combination (for auto-selection)
export function getCombinationSlots(combination: string[]): string[] {
  return [...combination];
}

// Check if a slot has multiple combination options
export function hasMultipleCombinations(slotCode: string): boolean {
  return getSlotCombinations(slotCode).length > 1;
}

// All available theory slot codes for the sidebar
export const ALL_THEORY_SLOTS = [
  'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2', 'F1', 'F2', 'G1', 'G2',
  'TA1', 'TA2', 'TB1', 'TB2', 'TC1', 'TC2', 'TD1', 'TD2', 'TE1', 'TE2', 'TF1', 'TF2', 'TG1', 'TG2',
  'TDD1', 'TDD2', 'TEE1', 'TEE2', 'TFF1', 'TFF2',
  'SA1', 'SA2', 'SB1', 'SB2', 'SC1', 'SC2', 'SD1', 'SD2', 'SE1', 'SE2', 'SF1', 'SF2',
];

// Lab slots are combined pairs
export const ALL_LAB_SLOTS = [
  'L1+L2', 'L3+L4', 'L5+L6', 'L7+L8', 'L9+L10', 'L11+L12',
  'L13+L14', 'L15+L16', 'L17+L18', 'L19+L20', 'L21+L22', 'L23+L24',
  'L25+L26', 'L27+L28', 'L29+L30', 'L31+L32', 'L33+L34', 'L35+L36',
  'L37+L38', 'L39+L40', 'L41+L42', 'L43+L44', 'L45+L46', 'L47+L48',
  'L49+L50', 'L51+L52', 'L53+L54', 'L55+L56', 'L57+L58', 'L59+L60',
  'L61+L62', 'L63+L64', 'L65+L66', 'L67+L68', 'L69+L70', 'L71+L72',
];

// Time column structure for clash detection
// Theory and Lab have different time boundaries that can overlap
// We use actual time ranges (minutes from midnight) for accurate clash detection

// Theory time boundaries (in minutes from midnight) - 10 slots total
export const THEORY_TIME_RANGES: [number, number][] = [
  [480, 530],   // 0: 8:00-8:50
  [540, 590],   // 1: 9:00-9:50
  [600, 650],   // 2: 10:00-10:50
  [660, 710],   // 3: 11:00-11:50
  [720, 770],   // 4: 12:00-12:50
  [840, 890],   // 5: 14:00-14:50 (2:00-2:50)
  [900, 950],   // 6: 15:00-15:50 (3:00-3:50)
  [960, 1010],  // 7: 16:00-16:50 (4:00-4:50)
  [1020, 1070], // 8: 17:00-17:50 (5:00-5:50)
  [1080, 1130], // 9: 18:00-18:50 (6:00-6:50)
];

// Lab time boundaries (in minutes from midnight) - 6 combined slots (1hr 40min each)
export const LAB_TIME_RANGES: [number, number][] = [
  [480, 580],   // 0: 8:00-9:40 (L1+L2, L7+L8, etc.)
  [590, 690],   // 1: 9:50-11:30
  [700, 790],   // 2: 11:40-13:10
  [840, 940],   // 3: 14:00-15:40 (2:00-3:40)
  [950, 1050],  // 4: 15:50-17:30 (3:50-5:30)
  [1060, 1150], // 5: 17:40-19:10 (5:40-7:10)
];

// Get slot info: returns { day, type, columnIndex } for a given slot code
export function getSlotInfo(slotCode: string): { day: Day; type: 'theory' | 'lab'; columnIndex: number } | null {
  for (const day of DAYS) {
    const structure = TIMETABLE_STRUCTURE[day];
    
    // Check theory slots
    const theoryIndex = structure.theory.indexOf(slotCode);
    if (theoryIndex !== -1) {
      return { day, type: 'theory', columnIndex: theoryIndex };
    }
    
    // Check lab slots
    const labIndex = structure.lab.indexOf(slotCode);
    if (labIndex !== -1) {
      return { day, type: 'lab', columnIndex: labIndex };
    }
  }
  return null;
}

// Get all occurrences of a slot code (same slot can appear on multiple days for combined slots)
export function getAllSlotOccurrences(slotCode: string): Array<{ day: Day; type: 'theory' | 'lab'; columnIndex: number }> {
  const occurrences: Array<{ day: Day; type: 'theory' | 'lab'; columnIndex: number }> = [];
  
  for (const day of DAYS) {
    const structure = TIMETABLE_STRUCTURE[day];
    
    // Check theory slots - a slot might appear multiple times (like E1 on MON)
    structure.theory.forEach((slot, index) => {
      if (slot === slotCode) {
        occurrences.push({ day, type: 'theory', columnIndex: index });
      }
    });
    
    // Check lab slots
    structure.lab.forEach((slot, index) => {
      if (slot === slotCode) {
        occurrences.push({ day, type: 'lab', columnIndex: index });
      }
    });
  }
  
  return occurrences;
}

// Check if two time ranges overlap
function timeRangesOverlap(range1: [number, number], range2: [number, number]): boolean {
  return range1[0] < range2[1] && range2[0] < range1[1];
}

interface BreakWindowRule {
  name: string;
  start: number;
  end: number;
  minimumFreeMinutes: number;
}

const BREAK_WINDOW_RULES: BreakWindowRule[] = [
  { name: 'Breakfast', start: 7 * 60 + 15, end: 9 * 60, minimumFreeMinutes: 45 },
  { name: 'Lunch', start: 12 * 60 + 15, end: 14 * 60, minimumFreeMinutes: 45 },
  { name: 'Snacks', start: 16 * 60 + 15, end: 18 * 60 + 15, minimumFreeMinutes: 15 },
  { name: 'Dinner', start: 19 * 60 + 15, end: 21 * 60, minimumFreeMinutes: 45 },
];

function getSlotTimeRange(slotOccurrence: { type: 'theory' | 'lab'; columnIndex: number }): [number, number] | null {
  return slotOccurrence.type === 'theory'
    ? THEORY_TIME_RANGES[slotOccurrence.columnIndex] || null
    : LAB_TIME_RANGES[slotOccurrence.columnIndex] || null;
}

function getOccupiedTimeRangesForDay(slotCodes: string[], day: Day): [number, number][] {
  const ranges: [number, number][] = [];

  for (const slotCode of slotCodes) {
    const occurrences = getAllSlotOccurrences(slotCode);
    for (const occurrence of occurrences) {
      if (occurrence.day !== day) continue;
      const timeRange = getSlotTimeRange(occurrence);
      if (timeRange) {
        ranges.push(timeRange);
      }
    }
  }

  return ranges;
}

function mergeRanges(ranges: [number, number][]): [number, number][] {
  if (ranges.length === 0) return [];

  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push([current[0], current[1]]);
    }
  }

  return merged;
}

function getMaxContinuousFreeTime(windowStart: number, windowEnd: number, occupiedRanges: [number, number][]): number {
  if (occupiedRanges.length === 0) return windowEnd - windowStart;
  
  let maxGap = 0;
  let currentStart = windowStart;
  
  for (const range of occupiedRanges) {
    if (range[0] > currentStart) {
      maxGap = Math.max(maxGap, range[0] - currentStart);
    }
    currentStart = Math.max(currentStart, range[1]);
  }
  
  if (windowEnd > currentStart) {
    maxGap = Math.max(maxGap, windowEnd - currentStart);
  }
  
  return maxGap;
}

function getOverlapRange(range1: [number, number], range2: [number, number]): [number, number] | null {
  const start = Math.max(range1[0], range2[0]);
  const end = Math.min(range1[1], range2[1]);
  return start < end ? [start, end] : null;
}

function getBreakRuleViolations(candidateSlotCode: string, assignedSlots: string[]): string[] {
  const violations: string[] = [];
  const candidateRelatedSlots = getRelatedSlotCodes(candidateSlotCode);
  const candidateOccurrences = candidateRelatedSlots.flatMap(slot => getAllSlotOccurrences(slot));

  if (candidateOccurrences.length === 0) return violations;

  const affectedDays = new Set<Day>(candidateOccurrences.map(occ => occ.day));
  const simulatedSlots = Array.from(new Set([...assignedSlots, ...candidateRelatedSlots]));

  for (const day of affectedDays) {
    const occupiedRanges = getOccupiedTimeRangesForDay(simulatedSlots, day);

    for (const rule of BREAK_WINDOW_RULES) {
      const breakWindow: [number, number] = [rule.start, rule.end];
      
      // Only check the rule if the candidate slot actually overlaps with this break window
      const candidateOccupiedRanges = getOccupiedTimeRangesForDay(candidateRelatedSlots, day);
      const candidateOverlapsWindow = candidateOccupiedRanges.some(range => getOverlapRange(range, breakWindow) !== null);
      
      if (!candidateOverlapsWindow) continue;

      const occupiedInWindow = occupiedRanges
        .map(range => getOverlapRange(range, breakWindow))
        .filter((range): range is [number, number] => range !== null);

      const mergedOccupied = mergeRanges(occupiedInWindow);
      const continuousFreeMinutes = getMaxContinuousFreeTime(rule.start, rule.end, mergedOccupied);

      if (continuousFreeMinutes < rule.minimumFreeMinutes) {
        violations.push(`${rule.name} break (${day})`);
      }
    }
  }

  return violations;
}

// Find all clashing slots for a given slot code based on time overlap
export function findClashingSlots(
  slotCode: string,
  assignedSlots: string[]
): string[] {
  const clashingSlots: string[] = [];
  const slotOccurrences = getAllSlotOccurrences(slotCode);
  
  if (slotOccurrences.length === 0) return [];
  
  for (const assignedSlot of assignedSlots) {
    if (assignedSlot === slotCode) continue; // Skip self
    
    const assignedOccurrences = getAllSlotOccurrences(assignedSlot);
    
    for (const slotOcc of slotOccurrences) {
      for (const assignedOcc of assignedOccurrences) {
        // Must be on the same day to clash
        if (slotOcc.day !== assignedOcc.day) continue;
        
        // Get time ranges
        const slotTimeRange = slotOcc.type === 'theory' 
          ? THEORY_TIME_RANGES[slotOcc.columnIndex]
          : LAB_TIME_RANGES[slotOcc.columnIndex];
          
        const assignedTimeRange = assignedOcc.type === 'theory'
          ? THEORY_TIME_RANGES[assignedOcc.columnIndex]
          : LAB_TIME_RANGES[assignedOcc.columnIndex];
        
        // Check for time overlap
        if (slotTimeRange && assignedTimeRange && timeRangesOverlap(slotTimeRange, assignedTimeRange)) {
          if (!clashingSlots.includes(assignedSlot)) {
            clashingSlots.push(assignedSlot);
          }
        }
      }
    }
  }

  const breakRuleViolations = getBreakRuleViolations(slotCode, assignedSlots);
  for (const violation of breakRuleViolations) {
    if (!clashingSlots.includes(violation)) {
      clashingSlots.push(violation);
    }
  }
  
  return clashingSlots;
}

// Find all slots that would clash with a given slot (for disabling in UI)
export function findAllClashingSlotCodes(assignedSlots: string[]): Set<string> {
  const clashingSet = new Set<string>();
  
  // For each possible slot in the timetable, check if it clashes with any assigned slot
  for (const day of DAYS) {
    const structure = TIMETABLE_STRUCTURE[day];
    
    // Check all theory slots
    structure.theory.forEach((slotCode) => {
      if (slotCode && !assignedSlots.includes(slotCode)) {
        const clashes = findClashingSlots(slotCode, assignedSlots);
        if (clashes.length > 0) {
          clashingSet.add(slotCode);
        }
      }
    });
    
    // Check all lab slots
    structure.lab.forEach((slotCode) => {
      if (slotCode && !assignedSlots.includes(slotCode)) {
        const clashes = findClashingSlots(slotCode, assignedSlots);
        if (clashes.length > 0) {
          clashingSet.add(slotCode);
        }
      }
    });
  }
  
  return clashingSet;
}

export function getRelatedSlotCodes(slotCode: string): string[] {
  // For combined slots like "A1/SE2", extract both parts
  const parts = slotCode.split('/');
  const allEquivalents: Set<string> = new Set(parts);
  
  // Start with the base slot codes themselves (important for assignment lookups)
  const relatedSlots: string[] = [...allEquivalents];
  
  for (const day of DAYS) {
    const structure = TIMETABLE_STRUCTURE[day];
    
    // Check theory slots
    structure.theory.forEach((slot) => {
      if (slot) {
        const slotParts = slot.split('/');
        // Check if any part of this slot matches any equivalent
        for (const slotPart of slotParts) {
          if (allEquivalents.has(slotPart) && !relatedSlots.includes(slot)) {
            relatedSlots.push(slot);
            break;
          }
        }
      }
    });
    
    // Check lab slots
    structure.lab.forEach((slot) => {
      if (slot) {
        const slotParts = slot.split('/');
        for (const slotPart of slotParts) {
          if (allEquivalents.has(slotPart) && !relatedSlots.includes(slot)) {
            relatedSlots.push(slot);
            break;
          }
        }
      }
    });
  }
  
  return relatedSlots;
}
