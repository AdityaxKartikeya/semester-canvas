import { SlotCell } from './SlotCell';
import { DAYS, TIMETABLE_STRUCTURE, SlotAssignment, Day } from '@/types/timetable';

interface TimetableGridProps {
  assignments: Record<string, SlotAssignment>;
  onSlotClick: (slotCode: string, type: 'theory' | 'lab') => void;
}

// Compact time headers - only columns that have slots
const TIME_HEADERS = [
  '08:00', '09:00', '10:00', '10:01', '11:00', '11:01', 
  '12:00', '12:01', '13:00', 'LUNCH', '14:00', '14:01', 
  '15:00', '15:01', '16:00', '16:01', '17:00', '17:01', '18:00'
];

// Theory slot mapping (11 theory slots per day in TIMETABLE_STRUCTURE)
const THEORY_COL_MAP: (number | null)[] = [
  0,    // 08:00 -> theory[0]
  1,    // 09:00 -> theory[1]
  2,    // 10:00 -> theory[2]
  3,    // 10:01 -> theory[3]
  4,    // 11:00 -> theory[4]
  null, // 11:01 -> no theory
  null, // 12:00 -> no theory
  null, // 12:01 -> no theory
  null, // 13:00 -> no theory
  null, // LUNCH
  6,    // 14:00 -> theory[6]
  7,    // 14:01 -> theory[7]
  8,    // 15:00 -> theory[8]
  9,    // 15:01 -> theory[9]
  10,   // 16:00 -> theory[10]
  null, // 16:01 -> no theory
  null, // 17:00 -> no theory
  null, // 17:01 -> no theory
  null, // 18:00 -> no theory
];

// Lab slot mapping (12 lab slots per day in TIMETABLE_STRUCTURE)
const LAB_COL_MAP: (number | null)[] = [
  0,    // 08:00 -> lab[0]
  1,    // 09:00 -> lab[1]
  2,    // 10:00 -> lab[2]
  3,    // 10:01 -> lab[3]
  4,    // 11:00 -> lab[4]
  5,    // 11:01 -> lab[5]
  null, // 12:00 -> no lab
  null, // 12:01 -> no lab
  null, // 13:00 -> no lab
  null, // LUNCH
  6,    // 14:00 -> lab[6]
  7,    // 14:01 -> lab[7]
  8,    // 15:00 -> lab[8]
  9,    // 15:01 -> lab[9]
  10,   // 16:00 -> lab[10]
  11,   // 16:01 -> lab[11]
  null, // 17:00 -> no lab
  null, // 17:01 -> no lab
  null, // 18:00 -> no lab
];

export function TimetableGrid({ assignments, onSlotClick }: TimetableGridProps) {
  const getTheorySlot = (day: Day, colIndex: number): string | null => {
    const slotIdx = THEORY_COL_MAP[colIndex];
    if (slotIdx === null || slotIdx === undefined) return null;
    return TIMETABLE_STRUCTURE[day].theory[slotIdx] || null;
  };

  const getLabSlot = (day: Day, colIndex: number): string | null => {
    const slotIdx = LAB_COL_MAP[colIndex];
    if (slotIdx === null || slotIdx === undefined) return null;
    return TIMETABLE_STRUCTURE[day].lab[slotIdx] || null;
  };

  return (
    <div className="timetable-container" id="timetable-export">
      <div className="timetable-header">
        <h2 className="text-xl font-bold text-primary">FFCS Timetable - Winter Semester 2025-26</h2>
        <p className="text-sm text-muted-foreground mt-1">Click any slot to assign a course</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="timetable-table unified-grid">
          <thead>
            <tr>
              <th className="timetable-th sticky-col">Day</th>
              <th className="timetable-th sticky-col-type">Type</th>
              {TIME_HEADERS.map((time, idx) => (
                <th key={`time-${idx}`} className="timetable-th time-header">
                  {time === 'LUNCH' ? '🍽️' : time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <>
                <tr key={`${day}-theory`} className="theory-row">
                  <td className="timetable-td sticky-col font-bold day-cell" rowSpan={2}>{day}</td>
                  <td className="timetable-td sticky-col-type type-label theory-label">THEORY</td>
                  {TIME_HEADERS.map((time, idx) => {
                    if (time === 'LUNCH') {
                      return (
                        <td key={`${day}-theory-lunch`} className="timetable-td p-0">
                          <SlotCell slotCode={null} type="theory" isLunch />
                        </td>
                      );
                    }
                    const slotCode = getTheorySlot(day, idx);
                    return (
                      <td key={`${day}-theory-${idx}`} className="timetable-td p-0">
                        <SlotCell
                          slotCode={slotCode}
                          assignment={slotCode ? assignments[slotCode] : undefined}
                          type="theory"
                          onClick={slotCode ? () => onSlotClick(slotCode, 'theory') : undefined}
                        />
                      </td>
                    );
                  })}
                </tr>
                <tr key={`${day}-lab`} className="lab-row">
                  <td className="timetable-td sticky-col-type type-label lab-label">LAB</td>
                  {TIME_HEADERS.map((time, idx) => {
                    if (time === 'LUNCH') {
                      return (
                        <td key={`${day}-lab-lunch`} className="timetable-td p-0">
                          <SlotCell slotCode={null} type="lab" isLunch />
                        </td>
                      );
                    }
                    const slotCode = getLabSlot(day, idx);
                    return (
                      <td key={`${day}-lab-${idx}`} className="timetable-td p-0">
                        <SlotCell
                          slotCode={slotCode}
                          assignment={slotCode ? assignments[slotCode] : undefined}
                          type="lab"
                          onClick={slotCode ? () => onSlotClick(slotCode, 'lab') : undefined}
                        />
                      </td>
                    );
                  })}
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
