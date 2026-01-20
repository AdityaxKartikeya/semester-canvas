import React from 'react';
import { SlotCell } from './SlotCell';
import { DAYS, TIMETABLE_STRUCTURE, THEORY_TIMES, LAB_TIMES, SlotAssignment, Day } from '@/types/timetable';

interface TimetableGridProps {
  assignments: Record<string, SlotAssignment>;
  isSlotClashing: (slotCode: string) => boolean;
  onSlotClick: (slotCode: string, type: 'theory' | 'lab') => void;
}

export function TimetableGrid({ assignments, isSlotClashing, onSlotClick }: TimetableGridProps) {
  // Theory: 5 morning + 5 afternoon (indices 0-4, 5-9)
  const theoryMorning = THEORY_TIMES.slice(0, 5);
  const theoryAfternoon = THEORY_TIMES.slice(6); // Skip LUNCH at index 5
  
  // Lab: 3 morning + 3 afternoon combined slots
  const labMorning = LAB_TIMES.slice(0, 3);
  const labAfternoon = LAB_TIMES.slice(4); // Skip LUNCH at index 3

  const getTheorySlot = (day: Day, index: number): string | null => {
    return TIMETABLE_STRUCTURE[day].theory[index] || null;
  };

  const getLabSlot = (day: Day, index: number): string | null => {
    return TIMETABLE_STRUCTURE[day].lab[index] || null;
  };

  return (
    <div className="timetable-container" id="timetable-export">
      <div className="timetable-header">
        <h2 className="text-xl font-bold text-primary">Freshers Winter Semester 2025-26 Slot Timetable</h2>
        <p className="text-sm text-muted-foreground mt-1">Click any slot to assign a course</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="timetable-table">
          <thead>
            {/* Theory Hours Header Row */}
            <tr className="theory-hours-header">
              <th className="timetable-th header-label">Theory Hours</th>
              {theoryMorning.map((time, idx) => (
                <th key={`theory-am-${idx}`} className="timetable-th time-header theory-time">
                  {time}
                </th>
              ))}
              <th className="timetable-th lunch-header" rowSpan={2}>
                <div className="lunch-vertical">LUNCH</div>
              </th>
              {theoryAfternoon.map((time, idx) => (
                <th key={`theory-pm-${idx}`} className="timetable-th time-header theory-time">
                  {time}
                </th>
              ))}
            </tr>
            {/* Lab Hours Header Row */}
            <tr className="lab-hours-header">
              <th className="timetable-th header-label">Lab Hours</th>
              {labMorning.map((time, idx) => (
                <th key={`lab-am-${idx}`} className="timetable-th time-header lab-time" colSpan={idx === 2 ? 1 : 2}>
                  {time}
                </th>
              ))}
              {labAfternoon.map((time, idx) => (
                <th key={`lab-pm-${idx}`} className="timetable-th time-header lab-time" colSpan={idx === 0 ? 1 : 2}>
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <React.Fragment key={day}>
                {/* Theory Row */}
                <tr className="theory-row">
                  <td className="timetable-td day-type-cell">
                    <span className="day-label">{day}</span>
                    <span className="type-label theory-label">Theory</span>
                  </td>
                  {/* Morning theory slots (5 slots) */}
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const slotCode = getTheorySlot(day, idx);
                    return (
                      <td key={`${day}-theory-am-${idx}`} className="timetable-td p-0">
                        <SlotCell
                          slotCode={slotCode}
                          assignment={slotCode ? assignments[slotCode] : undefined}
                          type="theory"
                          isDisabled={slotCode ? isSlotClashing(slotCode) : false}
                          onClick={slotCode ? () => onSlotClick(slotCode, 'theory') : undefined}
                        />
                      </td>
                    );
                  })}
                  {/* Lunch - spans 2 rows */}
                  <td className="timetable-td p-0 lunch-cell" rowSpan={2}>
                    <SlotCell slotCode={null} type="theory" isLunch />
                  </td>
                  {/* Afternoon theory slots (5 slots) */}
                  {[5, 6, 7, 8, 9].map((idx) => {
                    const slotCode = getTheorySlot(day, idx);
                    return (
                      <td key={`${day}-theory-pm-${idx}`} className="timetable-td p-0">
                        <SlotCell
                          slotCode={slotCode}
                          assignment={slotCode ? assignments[slotCode] : undefined}
                          type="theory"
                          isDisabled={slotCode ? isSlotClashing(slotCode) : false}
                          onClick={slotCode ? () => onSlotClick(slotCode, 'theory') : undefined}
                        />
                      </td>
                    );
                  })}
                </tr>
                {/* Lab Row */}
                <tr className="lab-row">
                  <td className="timetable-td day-type-cell">
                    <span className="day-label invisible">{day}</span>
                    <span className="type-label lab-label">Lab</span>
                  </td>
                  {/* Morning lab slots (3 combined slots spanning 2 theory columns each, except last) */}
                  {[0, 1, 2].map((idx) => {
                    const slotCode = getLabSlot(day, idx);
                    return (
                      <td key={`${day}-lab-am-${idx}`} className="timetable-td p-0" colSpan={idx === 2 ? 1 : 2}>
                        <SlotCell
                          slotCode={slotCode}
                          assignment={slotCode ? assignments[slotCode] : undefined}
                          type="lab"
                          isDisabled={slotCode ? isSlotClashing(slotCode) : false}
                          onClick={slotCode ? () => onSlotClick(slotCode, 'lab') : undefined}
                        />
                      </td>
                    );
                  })}
                  {/* Lunch cell is spanned from theory row */}
                  {/* Afternoon lab slots (3 combined slots) */}
                  {[3, 4, 5].map((idx) => {
                    const slotCode = getLabSlot(day, idx);
                    return (
                      <td key={`${day}-lab-pm-${idx}`} className="timetable-td p-0" colSpan={idx === 3 ? 1 : 2}>
                        <SlotCell
                          slotCode={slotCode}
                          assignment={slotCode ? assignments[slotCode] : undefined}
                          type="lab"
                          isDisabled={slotCode ? isSlotClashing(slotCode) : false}
                          onClick={slotCode ? () => onSlotClick(slotCode, 'lab') : undefined}
                        />
                      </td>
                    );
                  })}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
