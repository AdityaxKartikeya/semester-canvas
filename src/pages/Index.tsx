import { useState } from 'react';
import { TimetableGrid } from '@/components/TimetableGrid';
import { Sidebar } from '@/components/Sidebar';
import { AssignSlotDialog } from '@/components/AssignSlotDialog';
import { SlotSelectionDialog } from '@/components/SlotSelectionDialog';
import { CombinationSelectionDialog } from '@/components/CombinationSelectionDialog';
import { useTimetable } from '@/hooks/useTimetable';
import { exportToPNG, exportToPDF } from '@/utils/export';
import { toast } from '@/hooks/use-toast';
import { getRelatedSlotCodes, getSlotCombinations, hasMultipleCombinations } from '@/types/timetable';

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
  const [combinationSelectionOpen, setCombinationSelectionOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ code: string; type: 'theory' | 'lab' } | null>(null);
  const [selectedCombination, setSelectedCombination] = useState<string[] | null>(null);
  const [availableCombinations, setAvailableCombinations] = useState<string[][]>([]);

  const handleSlotClick = (slotCode: string, type: 'theory' | 'lab') => {
    // If the slot code contains a slash, it's an ambiguous slot that hasn't been resolved yet
    // (because TimetableGrid passes the resolved slot, so if we still see '/', it means no preference is set)
    if (slotCode.includes('/')) {
      setSelectedSlot({ code: slotCode, type });
      setSlotSelectionOpen(true);
    } else {
      // Check if this slot is already assigned - if so, just open the assignment dialog
      const existingAssignment = getAssignment(slotCode);
      if (existingAssignment) {
        setSelectedSlot({ code: slotCode, type });
        setSelectedCombination(null);
        setDialogOpen(true);
        return;
      }

      // Check if this slot has multiple possible combinations
      const combinations = getSlotCombinations(slotCode);
      
      if (combinations.length > 1) {
        // Show combination selection dialog
        setSelectedSlot({ code: slotCode, type });
        setAvailableCombinations(combinations);
        setCombinationSelectionOpen(true);
      } else if (combinations.length === 1) {
        // Only one combination, use it automatically
        setSelectedSlot({ code: slotCode, type });
        setSelectedCombination(combinations[0]);
        setDialogOpen(true);
      } else {
        // No predefined combination (e.g., lab slots), proceed normally
        setSelectedSlot({ code: slotCode, type });
        setSelectedCombination(null);
        setDialogOpen(true);
      }
    }
  };

  const handleCombinationSelect = (combination: string[]) => {
    setSelectedCombination(combination);
    setCombinationSelectionOpen(false);
    setDialogOpen(true);
  };

  const handleSlotSelection = (preferredSlot: string) => {
    if (selectedSlot) {
      setSlotPreference(selectedSlot.code, preferredSlot);
      setSlotSelectionOpen(false);

      toast({
        title: 'Slot Preference Saved',
        description: `You selected ${preferredSlot}. This choice will be remembered.`,
      });

      // After selection, check if the preferred slot has multiple combinations
      const combinations = getSlotCombinations(preferredSlot);
      
      if (combinations.length > 1) {
        // Show combination selection dialog
        setSelectedSlot({ code: preferredSlot, type: selectedSlot.type });
        setAvailableCombinations(combinations);
        setCombinationSelectionOpen(true);
      } else if (combinations.length === 1) {
        // Only one combination, use it automatically
        setSelectedSlot({ code: preferredSlot, type: selectedSlot.type });
        setSelectedCombination(combinations[0]);
        setDialogOpen(true);
      } else {
        // No predefined combination, proceed normally
        setSelectedSlot({ code: preferredSlot, type: selectedSlot.type });
        setSelectedCombination(null);
        setDialogOpen(true);
      }
    }
  };

  const handleAssign = (courseCode: string, courseName: string, professorName: string, color?: string) => {
    if (selectedSlot) {
      // If a combination was selected, assign all slots in the combination
      if (selectedCombination && selectedCombination.length > 0) {
        // Assign each slot in the combination
        for (const slot of selectedCombination) {
          assignSlot(slot, courseCode, courseName, professorName, color);
        }
        toast({
          title: 'Slots Assigned',
          description: `${courseCode} assigned to combination: ${selectedCombination.join(' + ')}`,
        });
      } else {
        // No combination, just assign the selected slot and its related slots
        const relatedSlots = getRelatedSlotCodes(selectedSlot.code);
        assignSlot(selectedSlot.code, courseCode, courseName, professorName, color);
        toast({
          title: 'Slots Assigned',
          description: `${courseCode} assigned to ${relatedSlots.length} slot${relatedSlots.length > 1 ? 's' : ''}: ${relatedSlots.join(', ')}`,
        });
      }
      // Reset combination selection
      setSelectedCombination(null);
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
        <CombinationSelectionDialog
          open={combinationSelectionOpen}
          onOpenChange={setCombinationSelectionOpen}
          slotCode={selectedSlot.code}
          combinations={availableCombinations}
          onSelect={handleCombinationSelect}
        />
      )}

      {selectedSlot && (
        <AssignSlotDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          slotCode={selectedCombination ? selectedCombination.join(' + ') : selectedSlot.code}
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
