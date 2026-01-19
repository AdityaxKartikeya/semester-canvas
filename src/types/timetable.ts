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

export const LAB_TIMES = [
  '8:00-8:50',
  '8:50-9:40',
  '9:50-10:40',
  '10:40-11:30',
  '11:40-12:30',
  '12:30-1:10',
  '2:00-2:50',
  '2:50-3:40',
  '3:50-4:40',
  '4:40-5:30',
  '5:40-6:30',
  '6:30-7:10',
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

// Complete slot structure based on the official timetable
export const TIMETABLE_STRUCTURE: Record<Day, { theory: (string | null)[]; lab: (string | null)[] }> = {
  MON: {
    theory: ['TA1', 'TB1', 'E1', 'E1', null, null, 'TA2', 'TB2', 'E2', 'E2', null],
    lab: ['L61', 'L62', 'L63', 'L64', 'L65', 'L66', 'L67', 'L68', 'L69', 'L70', 'L71', 'L72'],
  },
  TUE: {
    theory: ['TFF1', 'A1', 'B1', 'C1', 'D1', null, 'F2', 'A2', 'B2', 'C2', 'TDD2'],
    lab: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L31', 'L32', 'L33', 'L34', 'L35', 'L36'],
  },
  WED: {
    theory: ['TEE1', 'D1', 'F1', 'G1', 'B1', null, 'D2', 'F2', 'B2', 'G2', 'TG2'],
    lab: ['L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L37', 'L38', 'L39', 'L40', 'L41', 'L42'],
  },
  THU: {
    theory: ['TG1', 'C1', 'D1', 'A1', 'F1', null, 'E2', 'C2', 'A2', 'D2', 'TFF2'],
    lab: ['L13', 'L14', 'L15', 'L16', 'L17', 'L18', 'L43', 'L44', 'L45', 'L46', 'L47', 'L48'],
  },
  FRI: {
    theory: ['TDD1', 'B1', 'A1', 'G1', 'E1', null, 'TC2', 'B2', 'A2', 'G2', 'TEE2'],
    lab: ['L19', 'L20', 'L21', 'L22', 'L23', 'L24', 'L49', 'L50', 'L51', 'L52', 'L53', 'L54'],
  },
  SAT: {
    theory: ['TC1', 'C1', 'F1', 'G1', null, null, 'G2', 'D2', 'F2', null, 'C2'],
    lab: ['L25', 'L26', 'L27', 'L28', 'L29', 'L30', 'L55', 'L56', 'L57', 'L58', 'L59', 'L60'],
  },
};

// All available slot codes for the sidebar
export const ALL_THEORY_SLOTS = [
  'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2', 'F1', 'F2', 'G1', 'G2',
  'TA1', 'TA2', 'TB1', 'TB2', 'TC1', 'TC2', 'TD1', 'TD2', 'TE1', 'TE2', 'TF1', 'TF2', 'TG1', 'TG2',
  'TDD1', 'TDD2', 'TEE1', 'TEE2', 'TFF1', 'TFF2',
];

export const ALL_LAB_SLOTS = Array.from({ length: 72 }, (_, i) => `L${i + 1}`);
