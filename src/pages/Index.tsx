import { useState } from 'react';
import { TimetableGrid } from '@/components/TimetableGrid';
import { Sidebar } from '@/components/Sidebar';
import { AssignSlotDialog } from '@/components/AssignSlotDialog';
import { useTimetable } from '@/hooks/useTimetable';
import { exportToPNG, exportToPDF, exportToJSON, importFromJSON } from '@/utils/export';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const {
    assignments,
    courses,
    assignSlot,
    clearSlot,
    clearAll,
    getAssignment,
    exportData,
    importData,
  } = useTimetable();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ code: string; type: 'theory' | 'lab' } | null>(null);

  const handleSlotClick = (slotCode: string, type: 'theory' | 'lab') => {
    setSelectedSlot({ code: slotCode, type });
    setDialogOpen(true);
  };

  const handleAssign = (courseCode: string, courseName: string, professorName: string, color?: string) => {
    if (selectedSlot) {
      assignSlot(selectedSlot.code, courseCode, courseName, professorName, color);
      toast({
        title: 'Slot Assigned',
        description: `${courseCode} assigned to ${selectedSlot.code}`,
      });
    }
  };

  const handleClearSlot = () => {
    if (selectedSlot) {
      clearSlot(selectedSlot.code);
      toast({
        title: 'Slot Cleared',
        description: `${selectedSlot.code} has been cleared`,
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
    exportToPNG('timetable-export');
    toast({
      title: 'Exporting PNG',
      description: 'Your timetable is being downloaded...',
    });
  };

  const handleExportPDF = () => {
    exportToPDF('timetable-export');
    toast({
      title: 'Exporting PDF',
      description: 'Your timetable is being downloaded...',
    });
  };

  const handleExportJSON = () => {
    exportToJSON({ assignments, courses });
    toast({
      title: 'Timetable Saved',
      description: 'Your timetable data has been downloaded as JSON',
    });
  };

  const handleImportJSON = async () => {
    const jsonString = await importFromJSON();
    if (jsonString) {
      const success = importData(jsonString);
      if (success) {
        toast({
          title: 'Timetable Loaded',
          description: 'Your timetable has been restored',
        });
      } else {
        toast({
          title: 'Import Failed',
          description: 'Invalid timetable file',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        courses={courses}
        assignments={assignments}
        onClearAll={handleClearAll}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
      />
      
      <main className="main-content">
        <TimetableGrid
          assignments={assignments}
          onSlotClick={handleSlotClick}
        />
      </main>

      {selectedSlot && (
        <AssignSlotDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          slotCode={selectedSlot.code}
          slotType={selectedSlot.type}
          existingAssignment={getAssignment(selectedSlot.code)}
          existingCourses={courses}
          onAssign={handleAssign}
          onClear={handleClearSlot}
        />
      )}
    </div>
  );
};

export default Index;
