import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import { SLOT_COLORS, SlotAssignment } from '@/types/timetable';

interface AssignSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotCode: string;
  slotType: 'theory' | 'lab';
  existingAssignment?: SlotAssignment;
  existingCourses: Array<{ code: string; name: string; professor: string; color: string }>;
  clashingSlots: string[];
  onAssign: (courseCode: string, courseName: string, professorName: string, color?: string) => void;
  onClear: () => void;
}

export function AssignSlotDialog({
  open,
  onOpenChange,
  slotCode,
  slotType,
  existingAssignment,
  existingCourses,
  clashingSlots,
  onAssign,
  onClear,
}: AssignSlotDialogProps) {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [professorName, setProfessorName] = useState('');
  const [selectedColor, setSelectedColor] = useState(SLOT_COLORS[0]);

  // Parse slot code - if it contains '+', it's a combination
  const slotParts = slotCode.includes('+') ? slotCode.split(' + ') : [slotCode];
  const isCombination = slotParts.length > 1;
  const hasClash = clashingSlots.length > 0;

  // Reset form when dialog opens or slot changes
  useEffect(() => {
    if (open) {
      setCourseCode(existingAssignment?.courseCode || '');
      setCourseName(existingAssignment?.courseName || '');
      setProfessorName(existingAssignment?.professorName || '');
      setSelectedColor(existingAssignment?.colorTag || SLOT_COLORS[0]);
    }
  }, [open, slotCode, existingAssignment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (courseCode.trim() && courseName.trim()) {
      onAssign(courseCode.trim(), courseName.trim(), professorName.trim(), selectedColor);
      onOpenChange(false);
    }
  };

  const handleClear = () => {
    onClear();
    onOpenChange(false);
  };

  const handleSelectExisting = (course: typeof existingCourses[0]) => {
    setCourseCode(course.code);
    setCourseName(course.name);
    setProfessorName(course.professor);
    setSelectedColor(course.color);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span 
              className={`inline-block w-3 h-3 rounded ${slotType === 'theory' ? 'bg-primary' : 'bg-accent'}`} 
            />
            Assign Slot: {slotCode}
          </DialogTitle>
        </DialogHeader>
        
        {/* Related Slots Info */}
        {!existingAssignment && isCombination && (
          <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Will assign {slotParts.length} slots:</strong>{' '}
              {slotParts.join(', ')}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Clash Warning */}
        {hasClash && !existingAssignment && (
          <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-950">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Time Clash Detected!</strong> This slot conflicts with: {clashingSlots.join(', ')}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {existingCourses.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Quick Select Existing Course:</Label>
              <div className="flex flex-wrap gap-2">
                {existingCourses.map((course) => (
                  <button
                    key={course.code}
                    type="button"
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-white transition-transform hover:scale-105"
                    style={{ backgroundColor: course.color }}
                    onClick={() => handleSelectExisting(course)}
                  >
                    {course.code}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="courseCode">Course Code *</Label>
            <Input
              id="courseCode"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="e.g., CSE1001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseName">Course Name *</Label>
            <Input
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g., Problem Solving"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="professorName">Professor Name</Label>
            <Input
              id="professorName"
              value={professorName}
              onChange={(e) => setProfessorName(e.target.value)}
              placeholder="e.g., Dr. Smith"
            />
          </div>

          <div className="space-y-2">
            <Label>Color Tag</Label>
            <div className="flex flex-wrap gap-2">
              {SLOT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-all ${
                    selectedColor === color 
                      ? 'ring-2 ring-offset-2 ring-primary scale-110' 
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {existingAssignment && (
              <Button type="button" variant="destructive" onClick={handleClear}>
                Clear Slot
              </Button>
            )}
            <Button type="submit" className="bg-primary">
              {existingAssignment ? 'Update' : 'Assign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
