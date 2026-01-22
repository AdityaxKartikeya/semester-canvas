import { cn } from '@/lib/utils';
import { SlotAssignment } from '@/types/timetable';

interface SlotCellProps {
  slotCode: string | null;
  assignment?: SlotAssignment;
  type: 'theory' | 'lab';
  isLunch?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

export function SlotCell({ slotCode, assignment, type, isLunch, isDisabled, onClick }: SlotCellProps) {
  if (isLunch) {
    return (
      <div className="slot-cell slot-lunch flex items-center justify-center">
        {/* Lunch text is shown in header - cell is just styled */}
      </div>
    );
  }

  if (!slotCode) {
    return <div className="slot-cell slot-empty" />;
  }

  const isAssigned = !!assignment;

  return (
    <div
      className={cn(
        'slot-cell transition-all duration-200',
        type === 'theory' ? 'slot-theory' : 'slot-lab',
        isAssigned && 'slot-assigned',
        isDisabled && !isAssigned && 'slot-disabled',
        !isDisabled && !isAssigned && 'cursor-pointer'
      )}
      style={isAssigned ? { 
        backgroundColor: assignment.colorTag,
        borderColor: assignment.colorTag,
      } : undefined}
      onClick={!isDisabled || isAssigned ? onClick : undefined}
    >
      {isAssigned ? (
        <div className="flex flex-col items-center justify-center h-full p-1 text-white">
          <span className="slot-course-code font-bold text-xs leading-tight truncate w-full text-center drop-shadow-sm">
            {assignment.courseCode}
          </span>
          <span className="slot-detail text-[10px] leading-tight truncate w-full text-center opacity-90">
            {slotCode}
          </span>
          {assignment.professorName && (
            <span className="slot-detail text-[9px] leading-tight truncate w-full text-center opacity-80 mt-0.5">
              {assignment.professorName}
            </span>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <span className={cn(
            "text-xs font-medium",
            isDisabled ? "text-muted-foreground/40 line-through" : "text-muted-foreground"
          )}>{slotCode}</span>
        </div>
      )}
    </div>
  );
}
