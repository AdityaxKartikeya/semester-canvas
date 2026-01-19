import { SlotCell } from './SlotCell';
import { DAYS, THEORY_TIMES, LAB_TIMES, TIMETABLE_STRUCTURE, SlotAssignment } from '@/types/timetable';

interface TimetableGridProps {
  assignments: Record<string, SlotAssignment>;
  onSlotClick: (slotCode: string, type: 'theory' | 'lab') => void;
}

export function TimetableGrid({ assignments, onSlotClick }: TimetableGridProps) {
  return (
    <div className="timetable-container" id="timetable-export">
      <div className="timetable-header">
        <h2 className="text-xl font-bold text-primary">FFCS Timetable - Winter Semester 2025-26</h2>
      </div>
      
      {/* Theory Section */}
      <div className="mb-6">
        <div className="section-label">Theory Slots</div>
        <div className="overflow-x-auto">
          <table className="timetable-table">
            <thead>
              <tr>
                <th className="timetable-th sticky-col">Day</th>
                {THEORY_TIMES.map((time) => (
                  <th key={time} className="timetable-th">
                    {time === 'LUNCH' ? '🍽️' : time}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day}>
                  <td className="timetable-td sticky-col font-bold">{day}</td>
                  {THEORY_TIMES.map((time, idx) => {
                    if (time === 'LUNCH') {
                      return (
                        <td key={`${day}-lunch`} className="timetable-td p-0">
                          <SlotCell slotCode={null} type="theory" isLunch />
                        </td>
                      );
                    }
                    const slotCode = TIMETABLE_STRUCTURE[day].theory[idx > 5 ? idx - 1 : idx];
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lab Section */}
      <div>
        <div className="section-label">Lab Slots</div>
        <div className="overflow-x-auto">
          <table className="timetable-table">
            <thead>
              <tr>
                <th className="timetable-th sticky-col">Day</th>
                {LAB_TIMES.map((time) => (
                  <th key={time} className="timetable-th text-xs">{time}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day}>
                  <td className="timetable-td sticky-col font-bold">{day}</td>
                  {TIMETABLE_STRUCTURE[day].lab.map((slotCode, idx) => (
                    <td key={`${day}-lab-${idx}`} className="timetable-td p-0">
                      <SlotCell
                        slotCode={slotCode}
                        assignment={slotCode ? assignments[slotCode] : undefined}
                        type="lab"
                        onClick={slotCode ? () => onSlotClick(slotCode, 'lab') : undefined}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
