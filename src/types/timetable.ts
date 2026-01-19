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

// Theory: 5 morning slots + LUNCH + 5 afternoon slots (TUE-FRI have 10 slots, MON has 8, SAT has 8)
export const THEORY_TIMES = [
  '8:00-8:50',
  '9:00-9:50',
  '10:00-10:50',
  '11:00-11:50',
  '12:00-12:50',
  'LUNCH',
  '2:00-2:50',
  '3:00-3:50',
  '4:00-4:50',
  '5:00-5:50',
  '6:00-6:50',
] as const;

// Lab: 3 morning + 3 afternoon = 6 combined slots per day (labs are conducted in pairs)
export const LAB_TIMES = [
  '8:00-9:40',
  '9:50-11:30',
  '11:40-1:10',
  'LUNCH',
  '2:00-3:40',
  '3:50-5:30',
  '5:40-7:10',
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

// Complete slot structure based on Freshers Winter Semester 2025-26 Slot Timetable
// Theory: Up to 10 slots per day (index 0-4 = morning, 5-9 = afternoon)
// Lab: 6 combined slots per day (3 morning + 3 afternoon), each slot is a pair like L61+L62
export const TIMETABLE_STRUCTURE: Record<Day, { theory: (string | null)[]; lab: (string | null)[] }> = {
  MON: {
    theory: ['TA1', 'TB1', 'E1', 'E1', null, 'TA2', 'TB2', 'E2', 'E2', null],
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
    theory: ['TC1', 'C1', 'F1', 'G1/TD1', 'G2/TD2', 'D2', 'F2', 'C2', null, null],
    lab: ['L25+L26', 'L27+L28', 'L29+L30', 'L55+L56', 'L57+L58', 'L59+L60'],
  },
};

// All available slot codes for the sidebar (includes combined slots)
export const ALL_THEORY_SLOTS = [
  'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2', 'F1', 'F2', 'G1', 'G2',
  'TA1', 'TA2', 'TB1', 'TB2', 'TC1', 'TC2', 'TG1', 'TG2',
  'TDD1', 'TDD2', 'TEE1', 'TEE2', 'TFF1', 'TFF2',
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
// Each lab slot spans about 100 minutes
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

// Get all slot codes that share the same base slot
// A1 = TA1 = SA1, B1 = TB1 = SB1, etc.
// e.g., if you click "A1/SE2", this returns all slots containing A1, TA1, SA1, E2, TE2, SE2
export function getEquivalentSlots(baseSlot: string): string[] {
  // Extract the letter and number from the slot
  // Examples: A1 → (A, 1), TA1 → (A, 1), SA1 → (A, 1), TDD1 → (DD, 1), TEE1 → (EE, 1)
  
  // Handle special double-letter slots: TDD, TEE, TFF, TG
  const specialSlots: Record<string, string[]> = {
    'TDD1': ['TDD1'], 'TDD2': ['TDD2'],
    'TEE1': ['TEE1'], 'TEE2': ['TEE2'],
    'TFF1': ['TFF1'], 'TFF2': ['TFF2'],
    'TG1': ['TG1', 'G1'], 'TG2': ['TG2', 'G2'],
  };
  
  if (specialSlots[baseSlot]) {
    return specialSlots[baseSlot];
  }
  
  // For regular slots like A1, TA1, SA1, B1, TB1, SB1, etc.
  // Remove T or S prefix to get base letter
  let letter = baseSlot;
  let number = '';
  
  // Extract number (1 or 2) from the end
  const numMatch = baseSlot.match(/(\d)$/);
  if (numMatch) {
    number = numMatch[1];
    letter = baseSlot.slice(0, -1);
  }
  
  // Remove T or S prefix
  if (letter.startsWith('T') && letter.length === 2) {
    letter = letter.slice(1); // TA → A
  } else if (letter.startsWith('S') && letter.length === 2) {
    letter = letter.slice(1); // SA → A
  }
  
  // Return all equivalent forms
  return [
    `${letter}${number}`,     // A1
    `T${letter}${number}`,    // TA1
    `S${letter}${number}`,    // SA1
  ];
}

export function getRelatedSlotCodes(slotCode: string): string[] {
  // For combined slots like "A1/SE2", extract both parts
  const parts = slotCode.split('/');
  const allEquivalents: Set<string> = new Set();
  
  // Get all equivalent slot codes for each part
  for (const part of parts) {
    const equivalents = getEquivalentSlots(part);
    equivalents.forEach(eq => allEquivalents.add(eq));
  }
  
  const relatedSlots: string[] = [];
  
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
