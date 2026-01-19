import { cn } from '@/lib/utils';
import { SlotAssignment } from '@/types/timetable';

interface SlotCellProps {
  slotCode: string | null;
  assignment?: SlotAssignment;
  type: 'theory' | 'lab';
  isLunch?: boolean;
  onClick?: () => void;
}

export function SlotCell({ slotCode, assignment, type, isLunch, onClick }: SlotCellProps) {
  if (isLunch) {
    return (
      <div className="slot-cell slot-lunch flex items-center justify-center">
        <span className="text-muted-foreground font-medium text-sm">LUNCH</span>
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
        'slot-cell cursor-pointer transition-all duration-200',
        type === 'theory' ? 'slot-theory' : 'slot-lab',
        isAssigned && 'slot-assigned'
      )}
      style={isAssigned ? { 
        backgroundColor: assignment.colorTag,
        borderColor: assignment.colorTag,
      } : undefined}
      onClick={onClick}
    >
      {isAssigned ? (
        <div className="flex flex-col items-center justify-center h-full p-1 text-white">
          <span className="font-bold text-xs leading-tight truncate w-full text-center">
            {assignment.courseCode}
          </span>
          <span className="text-[10px] leading-tight truncate w-full text-center opacity-90">
            {assignment.professorName}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-xs font-medium text-muted-foreground">{slotCode}</span>
        </div>
      )}
    </div>
  );
}
