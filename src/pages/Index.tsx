import { useState } from 'react';
import { TimetableGrid } from '@/components/TimetableGrid';
import { Sidebar } from '@/components/Sidebar';
import { AssignSlotDialog } from '@/components/AssignSlotDialog';
import { SlotSelectionDialog } from '@/components/SlotSelectionDialog';
import { useTimetable } from '@/hooks/useTimetable';
import { exportToPNG, exportToPDF } from '@/utils/export';
import { toast } from '@/hooks/use-toast';
import { getRelatedSlotCodes } from '@/types/timetable';

const Index = () => {
  const {
    assignments,
    courses,
    assignSlot,
    clearSlot,
    clearAll,
    getAssignment,
    getSlotClashes,
    isSlotClashing,
    setSlotPreference,
    resolveSlot,
  } = useTimetable();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [slotSelectionOpen, setSlotSelectionOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ code: string; type: 'theory' | 'lab' } | null>(null);

  const handleSlotClick = (slotCode: string, type: 'theory' | 'lab') => {
    // If the slot code contains a slash, it's an ambiguous slot that hasn't been resolved yet
    // (because TimetableGrid passes the resolved slot, so if we still see '/', it means no preference is set)
    if (slotCode.includes('/')) {
      setSelectedSlot({ code: slotCode, type });
      setSlotSelectionOpen(true);
    } else {
      setSelectedSlot({ code: slotCode, type });
      setDialogOpen(true);
    }
  };

  const handleSlotSelection = (preferredSlot: string) => {
    if (selectedSlot) {
      setSlotPreference(selectedSlot.code, preferredSlot);
      setSlotSelectionOpen(false);

      // After selection, open the assignment dialog for the preferred slot
      // We need to wait a tick for the preference to update in the grid, 
      // but for the dialog we can just set the code directly
      setSelectedSlot({ code: preferredSlot, type: selectedSlot.type });
      setDialogOpen(true);

      toast({
        title: 'Slot Preference Saved',
        description: `You selected ${preferredSlot}. This choice will be remembered.`,
      });
    }
  };

  const handleAssign = (courseCode: string, courseName: string, professorName: string, color?: string) => {
    if (selectedSlot) {
      const relatedSlots = getRelatedSlotCodes(selectedSlot.code);
      assignSlot(selectedSlot.code, courseCode, courseName, professorName, color);
      toast({
        title: 'Slots Assigned',
        description: `${courseCode} assigned to ${relatedSlots.length} slot${relatedSlots.length > 1 ? 's' : ''}: ${relatedSlots.join(', ')}`,
      });
    }
  };

  const handleClearSlot = () => {
    if (selectedSlot) {
      const relatedSlots = getRelatedSlotCodes(selectedSlot.code);
      clearSlot(selectedSlot.code);
      toast({
        title: 'Slots Cleared',
        description: `${relatedSlots.length} slot${relatedSlots.length > 1 ? 's' : ''} cleared: ${relatedSlots.join(', ')}`,
      });
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear the entire timetable? This cannot be undone.')) {
      clearAll();
      toast({
        title: 'Timetable Cleared',
        description: 'All slots have been cleared',
      });
    }
  };

  const handleExportPNG = () => {
    exportToPNG(assignments);
    toast({
      title: 'Exporting PNG',
      description: 'Your timetable is being downloaded...',
    });
  };

  const handleExportPDF = () => {
    exportToPDF(assignments);
    toast({
      title: 'Exporting PDF',
      description: 'Your timetable is being downloaded...',
    });
  };

  return (
    <div className="app-layout">
      <Sidebar
        courses={courses}
        assignments={assignments}
        onClearAll={handleClearAll}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
      />

      <main className="main-content">
        <TimetableGrid
          assignments={assignments}
          isSlotClashing={isSlotClashing}
          onSlotClick={handleSlotClick}
          resolveSlot={resolveSlot}
        />
      </main>

      {selectedSlot && (
        <SlotSelectionDialog
          open={slotSelectionOpen}
          onOpenChange={setSlotSelectionOpen}
          slotCode={selectedSlot.code}
          onSelect={handleSlotSelection}
        />
      )}

      {selectedSlot && (
        <AssignSlotDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          slotCode={selectedSlot.code}
          slotType={selectedSlot.type}
          existingAssignment={getAssignment(selectedSlot.code)}
          existingCourses={courses}
          clashingSlots={getSlotClashes(selectedSlot.code)}
          onAssign={handleAssign}
          onClear={handleClearSlot}
        />
      )}
    </div>
  );
};

export default Index;
